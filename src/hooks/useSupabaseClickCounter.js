"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSupabaseClickCounter() {
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClickCount();

    const subscription = supabase
      .channel("cat_clicks_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cat_clicks",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          if (payload.new) {
            setClickCount(payload.new.total_clicks || 0);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchClickCount = async () => {
    try {
      const { data, error } = await supabase.from("cat_clicks").select("total_clicks").eq("id", 1).single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error;
      }

      setClickCount(data?.total_clicks || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching click count:", error);
      setError(error);
      setLoading(false);
    }
  };

  const incrementClick = async () => {
    try {
      // First, try to get the current count
      const { data: existingData, error: fetchError } = await supabase.from("cat_clicks").select("total_clicks").eq("id", 1).single();

      let newCount;

      if (fetchError && fetchError.code === "PGRST116") {
        // No record exists, create the first one
        newCount = 1;
        const { error: insertError } = await supabase.from("cat_clicks").insert([
          {
            id: 1,
            total_clicks: newCount,
            last_clicked_at: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;
      } else {
        if (fetchError) throw fetchError;

        newCount = (existingData?.total_clicks || 0) + 1;
        const { error: updateError } = await supabase
          .from("cat_clicks")
          .update({
            total_clicks: newCount,
            last_clicked_at: new Date().toISOString(),
          })
          .eq("id", 1);

        if (updateError) throw updateError;
      }

      setClickCount(newCount);
      return newCount;
    } catch (error) {
      console.error("Error incrementing click count:", error);
      setError(error);
      return clickCount;
    }
  };

  return {
    clickCount,
    incrementClick,
    loading,
    error,
  };
}
