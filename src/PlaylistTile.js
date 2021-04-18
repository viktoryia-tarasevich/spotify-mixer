import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./PlaylistTile.module.css";

function PlaylistTile({ name, image, id, snapshotId }) {
  const history = useHistory();

  return (
    <div
      className={styles.playlistTile}
      style={{ backgroundImage: `url('${image.url}')` }}
      onClick={() => history.push(`/playlist/${id}/${snapshotId}`)}
    >
      <h1>{name}</h1>
    </div>
  );
}

export default PlaylistTile;
