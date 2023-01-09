import React, { useEffect, useState, useCallback } from "react";
import { getPlaylists } from "./api";
import PlaylistTile from "./PlaylistTile";
import styles from './Dashboard.module.css'
function Dashboard() {
  const [playlists, setPlaylists] = useState([]);

  const initializePlaylists = useCallback(async () => {
    try{
        const playlists = await getPlaylists();
        if (playlists) {
          setPlaylists(playlists.items);
        }
    }
    catch(err){
        setPlaylists([])
        sessionStorage.removeItem("accessToken")
    }
  }, []);

  useEffect(() => {
    initializePlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    
    <div className={styles.playlists}> 
      {playlists.map((playlist,idx) => (
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
