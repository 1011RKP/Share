import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "ShareHolderPortalWebPartStrings";
import ShareHolderPortal from "./components/ShareHolderPortal";
import { IShareHolderPortalProps } from "./components/IShareHolderPortalProps";
import { Web } from "@pnp/sp";

export interface IShareHolderPortalWebPartProps {
  description: string;
  siteurl: string;
  spHttpClient: string;
}

export default class ShareHolderPortalWebPart extends BaseClientSideWebPart<
  IShareHolderPortalWebPartProps
> {
  public render(): void {
    const element: React.ReactElement<IShareHolderPortalProps> = React.createElement(
      ShareHolderPortal,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected _readGroups() {
    // Query for all groups on the tenant using Microsoft Graph.
    console.log("test");
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
