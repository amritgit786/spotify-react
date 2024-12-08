import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const CLIENT_ID = "916c91e5910d4046859b86d8c4b9e4b9";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      const tokenFromHash = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"));

      if (tokenFromHash) {
        token = tokenFromHash.split("=")[1];
        window.location.hash = "";
        window.localStorage.setItem("token", token);
      }
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "artist",
        },
      });

      setArtists(data.artists.items);
    } catch (error) {
      console.error("Error fetching data", error);
      alert("Failed to fetch artists. Please check your token or try again.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React App</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        <form onSubmit={searchArtists}>
          <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
          <button type={"submit"}>Search</button>
        </form>

        {artists.length > 0 && (
          <div>
            {artists.map((artist) => (
              <div key={artist.id}>
                {artist.images.length ? (
                  <img
                    width={"100%"}
                    src={artist.images[0].url}
                    alt={artist.name}
                  />
                ) : (
                  <div>No Image</div>
                )}
                <p>{artist.name}</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
