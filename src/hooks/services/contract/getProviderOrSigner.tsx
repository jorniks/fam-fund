import { useEffect, useState } from "react";
import useGetActiveProviderURL from "./getActiveProviderURL";
import { ethers } from "ethers";
import { defaultChainId } from "@/lib/services/chain-config";


function useGetProviderOrSigner() {
  const activeUrl = useGetActiveProviderURL();
  const [provider, setProvider] = useState<any>(undefined);

  useEffect(() => {
    getProvider();
  }, [activeUrl]);
  const getProvider = async () => {
    if (activeUrl) {
      let tempProvider = activeUrl.startsWith("http")
        ? new ethers.JsonRpcProvider(activeUrl, undefined, {
          staticNetwork: ethers.Network.from(defaultChainId),
        })
        : ethers.getDefaultProvider(activeUrl);
      setProvider(tempProvider);
    }
  };
  return provider;
}

export default useGetProviderOrSigner;
