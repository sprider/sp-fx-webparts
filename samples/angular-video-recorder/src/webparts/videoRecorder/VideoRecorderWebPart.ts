import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './VideoRecorderWebPart.module.scss';
import * as strings from 'VideoRecorderWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';

import * as angular from 'angular';
import './app/AppModule';
import Home from './app/Home';

export interface IVideoRecorderWebPartProps {
  libraryname: string;
}

export default class VideoRecorderWebPart extends BaseClientSideWebPart<IVideoRecorderWebPartProps> {

  private $injector: ng.auto.IInjectorService;

  public constructor(context: IWebPartContext) {
    super();
  }

  public render(): void {
    if (this.renderedOnce === false) {
      this.domElement.innerHTML = Home.templateHtml;
      this.componentDidMount();
    }

    this.sendWebPartProperties();
  }

  private componentDidMount(): void {
    try {

      if (!window["SP"]) {
        SPComponentLoader.loadScript('/_layouts/15/init.js', {
          globalExportsName: '$_global_init'
        })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', {
              globalExportsName: 'Sys'
            });
          })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.Core.js', {
              globalExportsName: 'SP'
            });
          })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', {
              globalExportsName: 'SP'
            });
          })
          .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.js', {
              globalExportsName: 'SP'
            });
          })
          .then((): void => {
            this.$injector = angular.bootstrap(this.domElement, ['videorecorderapp']);
            this.sendWebPartProperties();
          });
      }
      else {
        this.$injector = angular.bootstrap(this.domElement, ['videorecorderapp']);
        this.sendWebPartProperties();
      }
    }
    catch (error) {
      console.info("Unable to mount. Error:" + error);
    }
  }

  private sendWebPartProperties(): void {
    if (this.$injector) {
      this.$injector.get('$rootScope').$broadcast('configurationChanged', {
        libraryname: this.properties.libraryname,
        sphttpclient: this.context.spHttpClient,
        webabsoluteurl: this.context.pageContext.web.absoluteUrl
      });
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                PropertyPaneTextField('libraryname', {
                  label: strings.LibraryNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
