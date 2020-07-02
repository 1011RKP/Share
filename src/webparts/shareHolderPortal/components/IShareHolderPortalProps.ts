import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IShareHolderPortalProps {
  description: string;
  context: WebPartContext;
  siteurl: string;
  spHttpClient: SPHttpClient;
}
