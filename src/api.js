export const getPlaylists = () =>
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    },
  }).then((response) => response.json());

export const getTracksFromPlaylist = (playlistId, offset) =>
  fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}`,
    {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    }
  ).then((response) => response.json());

export const reorderTrackInPlaylist = (
  playlistId,
  snapshotId,
  rangeStart,
  insertBefore,
  rangeLength = 1
) =>
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    },
    body: JSON.stringify({
      range_start: rangeStart,
      insert_before: insertBefore,
      range_length: rangeLength,
      snapshot_id: snapshotId,
    }),
  })
    .then((response) => response.json());
    

export const getPlaylist = (playlistId) =>
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    },
  }).then((response) => response.json());
