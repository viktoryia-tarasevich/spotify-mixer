import React, { useEffect, useState, useCallback } from "react";
import { getPlaylists } from "./api";
import PlaylistTile from "./PlaylistTile";
import styles from './Dashboard.module.css'
function Dashboard() {
  const [playlists, setPlaylists] = useState([]);
  
  const initializePlaylists = useCallback(async () => {
    try{
      const queryParams ={
        limit:50,
        offset:0
      }
        const list = []
      while(true){
        const playlists = await getPlaylists(queryParams.limit,queryParams.offset);
        if (!playlists.items.length) {
          // Если список плейлистов пуст, значит мы достигли конца списка
          break;
        }
        list.push(...playlists.items);
      queryParams.offset += queryParams.limit;
      }
      setPlaylists(list);
    }
    catch(err){
        setPlaylists([])
        sessionStorage.removeItem("accessToken")
    }
  }, []);

  useEffect(() => {
    initializePlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[initializePlaylists]);

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
