import { ethers } from "ethers";
import { useEffect, useState } from "react";
import RPC from "@/lib/rpc-list";
import { defaultChainId } from "@/lib/services/chain-config";

function useGetActiveProviderURL() {
  const [activeUrl, setActiveUrl] = useState<string>("");
  useEffect(() => {
    helper();
  }, []);

  const helper = async () => {
    let provider = new ethers.JsonRpcProvider(RPC[defaultChainId][0], undefined, {
      staticNetwork: ethers.Network.from(defaultChainId),
    });
    
    try {
      await provider._detectNetwork();
      setActiveUrl(RPC[defaultChainId][0]);
    } catch (err) {
    }
  };

  return activeUrl;
}

export default useGetActiveProviderURL;
