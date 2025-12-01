import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getOrCreateDemoUser } from "../models/supabaseModel";
import HomeView from "../views/HomeView";

const HomeController = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const u = await getOrCreateDemoUser();
      if (mounted) setUser(u);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  return (
    <HomeView
      user={user}
      loading={loading}
      onTrackPress={() => router.push("/track")}
      onHistoryPress={() => router.push("/history")}
    />
  );
};

export default HomeController;
