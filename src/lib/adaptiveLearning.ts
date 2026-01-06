// Adaptive Learning System for Personalized User Experience
// This system learns from user behavior and adapts the application experience

interface UserBehavior {
  timestamp: Date;
  action: string;
  page: string;
  element?: string;
  data?: Record<string, any>;
  duration?: number;
}

interface LearningPattern {
  pattern: string;
  confidence: number;
  lastSeen: Date;
  frequency: number;
  associatedActions: string[];
}

interface AdaptiveRecommendation {
  type: 'content' | 'feature' | 'navigation' | 'timing';
  target: string;
  reason: string;
  confidence: number;
  priority: number;
}

class AdaptiveLearningEngine {
  private behaviors: UserBehavior[] = [];
  private patterns: Map<string, LearningPattern> = new Map();
  private recommendations: AdaptiveRecommendation[] = [];
  private readonly MAX_BEHAVIORS = 1000;
  private readonly PATTERN_THRESHOLD = 3; // Minimum occurrences to form a pattern

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPatterns();
  }

  // Track user behavior
  trackBehavior(behavior: Omit<UserBehavior, 'timestamp'>): void {
    const fullBehavior: UserBehavior = {
      ...behavior,
      timestamp: new Date(),
    };

    this.behaviors.push(fullBehavior);

    // Keep only recent behaviors
    if (this.behaviors.length > this.MAX_BEHAVIORS) {
      this.behaviors = this.behaviors.slice(-this.MAX_BEHAVIORS);
    }

    // Analyze behavior for patterns
    this.analyzeBehavior(fullBehavior);

    // Generate recommendations
    this.generateRecommendations();

    // Save to storage
    this.saveToStorage();
  }

  // Analyze individual behavior for patterns
  private analyzeBehavior(behavior: UserBehavior): void {
    // Look for sequential patterns
    const recentBehaviors = this.behaviors.slice(-10);
    if (recentBehaviors.length >= 2) {
      const sequence = recentBehaviors.map(b => b.action).join(' -> ');
      this.updatePattern(sequence, behavior);
    }

    // Look for page-specific patterns
    const pagePattern = `${behavior.page}:${behavior.action}`;
    this.updatePattern(pagePattern, behavior);

    // Look for time-based patterns
    const hour = behavior.timestamp.getHours();
    const timePattern = `${hour}:${behavior.action}`;
    this.updatePattern(timePattern, behavior);
  }

  private updatePattern(patternKey: string, behavior: UserBehavior): void {
    const existing = this.patterns.get(patternKey);

    if (existing) {
      existing.frequency++;
      existing.lastSeen = behavior.timestamp;
      existing.confidence = Math.min(existing.confidence + 0.1, 1.0);

      if (!existing.associatedActions.includes(behavior.action)) {
        existing.associatedActions.push(behavior.action);
      }
    } else if (this.patterns.size < 100) { // Limit patterns
      this.patterns.set(patternKey, {
        pattern: patternKey,
        confidence: 0.1,
        lastSeen: behavior.timestamp,
        frequency: 1,
        associatedActions: [behavior.action],
      });
    }
  }

  // Generate adaptive recommendations
  private generateRecommendations(): void {
    this.recommendations = [];

    // Analyze user interests
    const interests = this.analyzeInterests();

    // Content recommendations
    if (interests.includes('luxury')) {
      this.recommendations.push({
        type: 'content',
        target: 'luxury-services',
        reason: 'User shows interest in luxury services',
        confidence: 0.8,
        priority: 9,
      });
    }

    if (interests.includes('investment')) {
      this.recommendations.push({
        type: 'content',
        target: 'market-insights',
        reason: 'User interested in investment data',
        confidence: 0.7,
        priority: 8,
      });
    }

    // Navigation recommendations
    const preferredPages = this.analyzePreferredPages();
    if (preferredPages.length > 0) {
      this.recommendations.push({
        type: 'navigation',
        target: preferredPages[0],
        reason: 'Most visited page',
        confidence: 0.6,
        priority: 5,
      });
    }

    // Timing recommendations
    const optimalTimes = this.analyzeOptimalTimes();
    if (optimalTimes.length > 0) {
      this.recommendations.push({
        type: 'timing',
        target: 'tour-display',
        reason: `Optimal time: ${optimalTimes[0]}:00`,
        confidence: 0.5,
        priority: 3,
      });
    }

    // Feature recommendations
    if (this.detectSearchInterest()) {
      this.recommendations.push({
        type: 'feature',
        target: 'advanced-search',
        reason: 'User frequently uses search features',
        confidence: 0.75,
        priority: 7,
      });
    }
  }

  private analyzeInterests(): string[] {
    const interests: Record<string, number> = {};

    this.behaviors.forEach(behavior => {
      if (behavior.action.includes('luxury') || behavior.action.includes('concierge')) {
        interests.luxury = (interests.luxury || 0) + 1;
      }
      if (behavior.action.includes('investment') || behavior.action.includes('market')) {
        interests.investment = (interests.investment || 0) + 1;
      }
      if (behavior.action.includes('search') || behavior.action.includes('filter')) {
        interests.search = (interests.search || 0) + 1;
      }
      if (behavior.action.includes('neighborhood') || behavior.action.includes('location')) {
        interests.location = (interests.location || 0) + 1;
      }
    });

    return Object.entries(interests)
      .filter(([, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .map(([interest]) => interest);
  }

  private analyzePreferredPages(): string[] {
    const pageVisits: Record<string, number> = {};

    this.behaviors.forEach(behavior => {
      pageVisits[behavior.page] = (pageVisits[behavior.page] || 0) + 1;
    });

    return Object.entries(pageVisits)
      .sort(([, a], [, b]) => b - a)
      .map(([page]) => page);
  }

  private analyzeOptimalTimes(): number[] {
    const hourlyActivity: Record<number, number> = {};

    this.behaviors.forEach(behavior => {
      const hour = behavior.timestamp.getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    return Object.entries(hourlyActivity)
      .sort(([, a], [, b]) => b - a)
      .map(([hour]) => parseInt(hour));
  }

  private detectSearchInterest(): boolean {
    const searchActions = this.behaviors.filter(b =>
      b.action.includes('search') || b.action.includes('filter')
    ).length;

    return searchActions >= 3;
  }

  // Public API methods
  getRecommendations(type?: string): AdaptiveRecommendation[] {
    let filtered = this.recommendations;

    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }

    return filtered.sort((a, b) => b.priority - a.priority);
  }

  getUserProfile(): {
    interests: string[];
    preferredPages: string[];
    optimalTimes: number[];
    behaviorPatterns: string[];
  } {
    return {
      interests: this.analyzeInterests(),
      preferredPages: this.analyzePreferredPages(),
      optimalTimes: this.analyzeOptimalTimes(),
      behaviorPatterns: Array.from(this.patterns.keys()).filter(key =>
        (this.patterns.get(key)?.frequency || 0) >= this.PATTERN_THRESHOLD
      ),
    };
  }

  predictNextAction(currentContext: { page: string; action: string }): string[] {
    const relevantPatterns = Array.from(this.patterns.values()).filter(pattern =>
      pattern.pattern.includes(currentContext.action) &&
      pattern.frequency >= this.PATTERN_THRESHOLD
    );

    const predictions: Record<string, number> = {};

    relevantPatterns.forEach(pattern => {
      pattern.associatedActions.forEach(action => {
        if (action !== currentContext.action) {
          predictions[action] = (predictions[action] || 0) + pattern.confidence;
        }
      });
    });

    return Object.entries(predictions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([action]) => action);
  }

  // Storage methods
  private saveToStorage(): void {
    try {
      const data = {
        behaviors: this.behaviors.slice(-100), // Save last 100 behaviors
        patterns: Array.from(this.patterns.entries()),
        recommendations: this.recommendations,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('adaptive-learning-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save adaptive learning data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('adaptive-learning-data');
      if (data) {
        const parsed = JSON.parse(data);
        this.behaviors = parsed.behaviors || [];
        this.patterns = new Map(parsed.patterns || []);
        this.recommendations = parsed.recommendations || [];
      }
    } catch (error) {
      console.warn('Failed to load adaptive learning data:', error);
    }
  }

  private initializeDefaultPatterns(): void {
    // Initialize with some common patterns to help bootstrap learning
    const defaultPatterns = [
      { key: '/listings:view_property', actions: ['contact_agent', 'schedule_tour'] },
      { key: '/neighborhoods:view_area', actions: ['search_properties', 'contact_agent'] },
      { key: 'search:filter_applied', actions: ['view_property', 'save_search'] },
      { key: 'tour_completed', actions: ['view_listings', 'contact_concierge'] },
    ];

    defaultPatterns.forEach(({ key, actions }) => {
      if (!this.patterns.has(key)) {
        this.patterns.set(key, {
          pattern: key,
          confidence: 0.3,
          lastSeen: new Date(),
          frequency: 1,
          associatedActions: actions,
        });
      }
    });
  }

  // Reset learning data (useful for testing or user preference)
  reset(): void {
    this.behaviors = [];
    this.patterns.clear();
    this.recommendations = [];
    localStorage.removeItem('adaptive-learning-data');
    this.initializeDefaultPatterns();
  }
}

// Singleton instance
export const adaptiveLearning = new AdaptiveLearningEngine();

// Utility functions for easy integration
export const trackUserAction = (action: string, page: string, data?: Record<string, any>) => {
  adaptiveLearning.trackBehavior({ action, page, data });
};

export const getPersonalizedRecommendations = (type?: string) => {
  return adaptiveLearning.getRecommendations(type);
};

export const predictUserBehavior = (currentPage: string, currentAction: string) => {
  return adaptiveLearning.predictNextAction({ page: currentPage, action: currentAction });
};

export const getUserInsights = () => {
  return adaptiveLearning.getUserProfile();
};
