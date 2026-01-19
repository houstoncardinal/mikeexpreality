import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type TableName = 'leads' | 'properties' | 'transactions' | 'showings' | 'tasks' | 'staff' | 'blog_posts' | 'blog_categories';

interface UseRealtimeDataOptions {
  table: TableName;
  queryKey: string[];
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  showToasts?: boolean;
}

const tableLabels: Record<TableName, string> = {
  leads: 'Lead',
  properties: 'Property',
  transactions: 'Transaction',
  showings: 'Showing',
  tasks: 'Task',
  staff: 'Team Member',
  blog_posts: 'Blog Post',
  blog_categories: 'Category',
};

export function useRealtimeData({
  table,
  queryKey,
  onInsert,
  onUpdate,
  onDelete,
  showToasts = true,
}: UseRealtimeDataOptions) {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
        },
        (payload) => {
          invalidateQueries();
          onInsert?.(payload.new);
          if (showToasts) {
            toast.success(`New ${tableLabels[table]} added`, {
              description: 'Data refreshed automatically',
              duration: 3000,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
        },
        (payload) => {
          invalidateQueries();
          onUpdate?.(payload.new);
          if (showToasts) {
            toast.info(`${tableLabels[table]} updated`, {
              description: 'Changes synced in real-time',
              duration: 2000,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
        },
        (payload) => {
          invalidateQueries();
          onDelete?.(payload.old);
          if (showToasts) {
            toast.info(`${tableLabels[table]} removed`, {
              duration: 2000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, invalidateQueries, onInsert, onUpdate, onDelete, showToasts]);

  return { invalidateQueries };
}

// Hook for subscribing to multiple tables at once
export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const tables: TableName[] = ['leads', 'properties', 'transactions', 'showings', 'tasks'];
    
    const channels = tables.map((table) =>
      supabase
        .channel(`dashboard-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
          },
          () => {
            // Invalidate all dashboard-related queries
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: [table] });
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [queryClient]);
}
