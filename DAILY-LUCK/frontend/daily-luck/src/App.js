import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./utils/theme";

import Header from "./components/common/Header";
import Home from "./components/Home";
import Mint from "./components/Mint";
import NftPage from "./components/NftPage";

function App() {
  const [mode, setMode] = useState("dark");
  const [page, setPage] = useState("home");
  const [account, setAccount] = useState(null);
  const [userNfts, setUserNfts] = useState([]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  console.log("account ", account);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header 
        mode={mode} 
        toggleTheme={toggleTheme} 
        page={page} 
        setPage={setPage} 
        setAccountUser={setAccount} 
        setUserNfts={setUserNfts}
      />
      {page === "home" && <Home page={page} setPage={setPage}/>}
      {page === "nfts" && <NftPage userNfts={userNfts}/>}
      {page === "mint" && <Mint setUserNfts={setUserNfts} account={account}/>}
    </ThemeProvider>
  );
}

export default App;