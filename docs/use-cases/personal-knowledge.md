---
title: Personal Knowledge Management
sidebar_label: Personal Knowledge
---

# Personal Knowledge Management with Lanonasis

Build a powerful personal knowledge base that learns from your notes, documents, and thoughts.

## Memory Journal App

### Complete Implementation

```typescript
import { MemoryClient } from '@lanonasis/memory-client';

class JournalApp {
  private client: MemoryClient;
  
  constructor(apiKey: string) {
    this.client = new MemoryClient({
      apiKey,
      namespace: 'journal'
    });
  }
  
  async addEntry(content: string, mood: string, tags: string[] = []) {
    return await this.client.upsert({
      id: `journal-${Date.now()}`,
      text: content,
      metadata: {
        type: 'journal',
        mood,
        tags,
        date: new Date().toISOString(),
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200)
      }
    });
  }
  
  async searchEntries(query: string, filters?: any) {
    return await this.client.search({
      query,
      namespace: 'journal',
      filters: {
        type: 'journal',
        ...filters
      },
      includeMetadata: true,
      topK: 20
    });
  }
  
  async getMoodInsights(dateRange: [Date, Date]) {
    // Analyze mood patterns over time
    const entries = await this.client.search({
      query: '',
      namespace: 'journal',
      filters: {
        date: {
          $gte: dateRange[0].toISOString(),
          $lte: dateRange[1].toISOString()
        }
      },
      topK: 1000
    });
    
    const moodCounts = entries.matches.reduce((acc, entry) => {
      const mood = entry.metadata?.mood;
      if (mood) {
        acc[mood] = (acc[mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalEntries: entries.matches.length,
      moodDistribution: moodCounts,
      dominantMood: Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }
  
  async generateWeeklySummary() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = await this.searchEntries('', {
      date: { $gte: oneWeekAgo.toISOString() }
    });
    
    // Use MaaS to generate a summary
    const summary = await this.client.generateSummary({
      memories: recentEntries.matches.map(m => m.id),
      prompt: "Summarize the key themes and insights from this week's journal entries"
    });
    
    return summary;
  }
}

// Usage Example
const journal = new JournalApp(process.env.LANONASIS_API_KEY!);

// Add a journal entry
await journal.addEntry(
  "Had a breakthrough on the project today. The solution was simpler than expected.",
  "excited",
  ["work", "breakthrough", "project-x"]
);

// Search for specific topics
const workEntries = await journal.searchEntries("project breakthroughs");

// Get mood insights
const insights = await journal.getMoodInsights([
  new Date('2024-01-01'),
  new Date()
]);

console.log('Mood distribution:', insights.moodDistribution);
```

## Research Assistant

### Organize and Search Research Papers

```typescript
class ResearchAssistant {
  private client: MemoryClient;
  
  async addPaper(paper: {
    title: string;
    abstract: string;
    authors: string[];
    url: string;
    tags: string[];
  }) {
    // Store the paper with rich metadata
    const memory = await this.client.upsert({
      text: `${paper.title}\n\n${paper.abstract}`,
      metadata: {
        type: 'research_paper',
        title: paper.title,
        authors: paper.authors,
        url: paper.url,
        tags: paper.tags,
        addedAt: new Date().toISOString()
      }
    });
    
    // Extract and store key concepts
    await this.extractConcepts(paper);
    
    return memory;
  }
  
  async findRelatedPapers(query: string) {
    // Use semantic search to find related research
    const results = await this.client.search({
      query,
      filters: { type: 'research_paper' },
      topK: 10
    });
    
    // Group by similarity score
    return results.matches.map(match => ({
      title: match.metadata?.title,
      authors: match.metadata?.authors,
      relevanceScore: match.score,
      url: match.metadata?.url
    }));
  }
  
  async generateLiteratureReview(topic: string) {
    // Find all relevant papers
    const papers = await this.findRelatedPapers(topic);
    
    // Generate a structured review
    const review = await this.client.generateFromMemories({
      query: `Create a literature review on: ${topic}`,
      memoryIds: papers.map(p => p.id),
      format: 'academic'
    });
    
    return review;
  }
  
  private async extractConcepts(paper: any) {
    // Extract key concepts and create separate memories
    const concepts = await this.client.extractEntities({
      text: paper.abstract,
      types: ['concept', 'method', 'result']
    });
    
    for (const concept of concepts) {
      await this.client.upsert({
        text: concept.text,
        metadata: {
          type: 'concept',
          sourceType: 'research_paper',
          sourcePaper: paper.title,
          conceptType: concept.type
        }
      });
    }
  }
}
```

## Note-Taking System

### Smart Notes with Automatic Linking

```typescript
class SmartNotes {
  private client: MemoryClient;
  
  async createNote(content: string, title?: string) {
    // Auto-generate title if not provided
    const noteTitle = title || await this.generateTitle(content);
    
    // Store the note
    const note = await this.client.upsert({
      text: content,
      metadata: {
        type: 'note',
        title: noteTitle,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        wordCount: content.split(' ').length
      }
    });
    
    // Find and link related notes
    await this.linkRelatedNotes(note.id);
    
    return note;
  }
  
  async linkRelatedNotes(noteId: string) {
    // Find semantically similar notes
    const note = await this.client.get(noteId);
    const related = await this.client.search({
      query: note.text,
      filters: {
        type: 'note',
        id: { $ne: noteId } // Exclude self
      },
      topK: 5,
      threshold: 0.7 // High similarity threshold
    });
    
    // Create bidirectional links
    for (const relatedNote of related.matches) {
      await this.client.updateMetadata(noteId, {
        relatedNotes: [...(note.metadata?.relatedNotes || []), relatedNote.id]
      });
      
      await this.client.updateMetadata(relatedNote.id, {
        relatedNotes: [...(relatedNote.metadata?.relatedNotes || []), noteId]
      });
    }
    
    return related.matches.length;
  }
  
  async searchNotes(query: string, options?: {
    dateRange?: [Date, Date];
    tags?: string[];
  }) {
    const filters: any = { type: 'note' };
    
    if (options?.dateRange) {
      filters.createdAt = {
        $gte: options.dateRange[0].toISOString(),
        $lte: options.dateRange[1].toISOString()
      };
    }
    
    if (options?.tags) {
      filters.tags = { $in: options.tags };
    }
    
    return await this.client.search({
      query,
      filters,
      includeMetadata: true
    });
  }
  
  async generateDailyDigest() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysNotes = await this.searchNotes('', {
      dateRange: [today, new Date()]
    });
    
    if (todaysNotes.matches.length === 0) {
      return "No notes created today.";
    }
    
    // Generate a summary of today's notes
    const digest = await this.client.generateSummary({
      memories: todaysNotes.matches.map(m => m.id),
      prompt: "Create a brief digest of today's notes, highlighting key insights and action items"
    });
    
    return digest;
  }
  
  private async generateTitle(content: string): Promise<string> {
    // Use first line or generate from content
    const firstLine = content.split('\n')[0];
    if (firstLine.length < 100) {
      return firstLine;
    }
    
    // Generate title using MaaS
    const title = await this.client.generate({
      prompt: `Generate a concise title for this note: ${content.substring(0, 200)}`,
      maxTokens: 10
    });
    
    return title;
  }
}
```

## Best Practices

### 1. Organize with Namespaces

```typescript
// Separate different types of knowledge
const workMemories = new MemoryClient({ namespace: 'work' });
const personalMemories = new MemoryClient({ namespace: 'personal' });
const learningMemories = new MemoryClient({ namespace: 'learning' });
```

### 2. Use Rich Metadata

```typescript
// Add structured metadata for better organization
await client.upsert({
  text: "Meeting notes...",
  metadata: {
    type: 'meeting',
    project: 'ProjectX',
    participants: ['Alice', 'Bob'],
    actionItems: ['Review proposal', 'Send follow-up'],
    priority: 'high',
    deadline: '2024-02-01'
  }
});
```

### 3. Regular Maintenance

```typescript
// Periodically consolidate and clean up memories
async function consolidateMemories() {
  // Find duplicate or similar memories
  const allMemories = await client.list({ limit: 1000 });
  
  for (const memory of allMemories) {
    const duplicates = await client.search({
      query: memory.text,
      threshold: 0.95, // Very high similarity
      filters: { id: { $ne: memory.id } }
    });
    
    if (duplicates.matches.length > 0) {
      // Merge metadata and delete duplicates
      await mergeDuplicates(memory, duplicates.matches);
    }
  }
}
```

## Integration Examples

### Browser Extension

```typescript
// Save web content to your knowledge base
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action === 'save_to_memory') {
    const memory = await client.upsert({
      text: request.selectedText || request.pageContent,
      metadata: {
        type: 'web_clip',
        url: request.url,
        title: request.title,
        timestamp: new Date().toISOString()
      }
    });
    
    return { success: true, memoryId: memory.id };
  }
});
```

### Obsidian Plugin

```typescript
// Sync Obsidian notes with Lanonasis
class ObsidianSync {
  async syncVault(vaultPath: string) {
    const files = await this.getMarkdownFiles(vaultPath);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const metadata = this.extractFrontmatter(content);
      
      await client.upsert({
        id: `obsidian-${file}`,
        text: content,
        metadata: {
          type: 'obsidian_note',
          path: file,
          ...metadata
        }
      });
    }
  }
}
```

## Next Steps

- [Explore Team Collaboration →](/use-cases/team-collaboration)
- [Build Customer Support Systems →](/use-cases/customer-support)
- [View API Reference →](/api/overview)
