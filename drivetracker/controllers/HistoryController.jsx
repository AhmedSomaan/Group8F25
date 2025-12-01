import React, { useEffect, useState } from "react";
import { getOrCreateDemoUser, getTripsForUser } from "../models/supabaseModel";
import HistoryView from "../views/HistoryView";

const HistoryController = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const user = await getOrCreateDemoUser();
      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }
      if (mounted) setUser(user);
      const t = await getTripsForUser(user.id);
      if (mounted) setTrips(t || []);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  return <HistoryView trips={trips} loading={loading} user={user} />;
};

export default HistoryController;
