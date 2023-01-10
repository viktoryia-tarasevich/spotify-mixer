import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTracksFromPlaylist, reorderTrackInPlaylist } from "./api";

const DEFAULT_OFFSET = 100;

function Playlist() {
  let { id, snaphshotId } = useParams();

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const sortTracks = (tracks) => {
    const mappedList = tracks
      .map((item, index) => {
        return {
          ...item,
          currentOrder: index,
          progressed: false,
        };
      })
      .sort((a, b) => {
        return Date.parse(a.added_at) - Date.parse(b.added_at);
      });

    return mappedList;
  };
  const refresh = async () => {
    let currentSnapshotId = snaphshotId;
    let playlistTotal = playlistTracks.length;
    if (playlistTracks.length > 0) {
      let mappedList = sortTracks(playlistTracks);
      let oldTrack = mappedList[0].currentOrder;
      if (playlistTotal > oldTrack) {
        for await (let item of mappedList) {
          if (item.currentOrder > oldTrack) {
            console.log(item.currentOrder);
            const { snapshot_id } = await reorderTrackInPlaylist(
              id,
              currentSnapshotId,
              item.currentOrder,
              0,
              1
            );
            currentSnapshotId = snapshot_id;
          }
        }
      }
    }
  };
  //  if (playlistTracks.length > 0) {
  //    console.log("Всего песен:" + playlistTracks.length);
  //    playlistTracks.forEach((tracks, idx) =>
  //      console.log(
  //        "Название:" +
  //          tracks.track.name +
  //          "/" +
  //          "Номер трека:" +
  //          (idx + 1) +
  //           "/" +
  //          "Дата:" +
  //          tracks.added_at
  //      )
  //    );
  //  }

  const getTracks = async (offset, items) => {
    const playlistData = await getTracksFromPlaylist(id, offset);
    if (playlistData) {
      if (playlistData.next) {
        return await getTracks(playlistData.offset + DEFAULT_OFFSET, [
          ...items,
          ...playlistData.items,
        ]);
      }
      if (!playlistData.next) {
        return [...items, ...playlistData.items];
      }
    }
  };

  const shuffleTracks = async () => {
    const playlistLength = playlistTracks.length;
    let currentSnapshotId = snaphshotId;
    let i = 1;
    for await (let item of sortTracks(playlistTracks)) {
      const newOrderOfTracks = await getTracks(0, []);
      setPlaylistTracks([...newOrderOfTracks]);

      const currentTrack = sortTracks(newOrderOfTracks).find(
        (newItem) => newItem.track.id === item.track.id
      );
      const index = currentTrack.currentOrder;
      const { snapshot_id } = await reorderTrackInPlaylist(
        id,
        currentSnapshotId,
        index,
        0,
        1
      );
      currentSnapshotId = snapshot_id;
      console.log(`${i++}/${playlistLength}`);
      console.log(currentSnapshotId);
    }
  };

  const initializeTracks = async () => {
    const tracks = await getTracks(0, []);
    setPlaylistTracks([...tracks]);
  };

  useEffect(() => {
    initializeTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <button onClick={() => shuffleTracks()}>Shuffle ALL</button>
      <button onClick={() => refresh()}>Refresh</button>
      {playlistTracks.map((item) => (
        <div
          key={`track-${item.track.id}-${item.track.name}`}
          style={{ color: item.progressed ? "green" : "red" }}
        >
          {item.track.name}
        </div>
      ))}
    </div>
  );
}

export default Playlist;
