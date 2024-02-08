import React, { useEffect, useState, useCallback } from "react";
import { getPlaylists } from "./api";
import PlaylistTile from "./PlaylistTile";
import styles from './Dashboard.module.css'
function Dashboard() {
  const [playlists, setPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState(0);

  const initializePlaylists = useCallback(async () => {
    try {
      const queryParams = {
        limit: 50,
        offset: 0
      }
      const list = [];

      while (list.length < totalPlaylists) {
        const playlists = await getPlaylists(queryParams.limit, queryParams.offset);
        list.push(...playlists.items);
        queryParams.offset += queryParams.limit;
      }
      setPlaylists(list);
    }
    catch (err) {
      setPlaylists([])
      sessionStorage.removeItem("accessToken")
    }
  }, [totalPlaylists]);

  useEffect(() => {
    async function fetchTotalPlaylists() {
      try {
        const fetchedPlaylists = await getPlaylists(1, 0); // Получаем первый плейлист, чтобы узнать общее количество плейлистов
        setTotalPlaylists(fetchedPlaylists.total);
      } catch (err) {
        console.error('Error fetching total playlists:', err);
        setTotalPlaylists(0);
      }
    }

    fetchTotalPlaylists();
  }, []);

  useEffect(() => {
    initializePlaylists();
  }, [initializePlaylists]);

  return (

    <div className={styles.playlists}>
      {playlists.map((playlist, idx) => (
        <PlaylistTile
          name={playlist.name}
          image={playlist.images[0]}
          id={playlist.id}
          key={idx}
          snapshotId={playlist.snapshot_id}
        />
      ))}
    </div>
  );
}

export default Dashboard;
