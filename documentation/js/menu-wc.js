'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">org.txosteo.tomaprofile documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' : 'data-target="#xs-components-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' : 'id="xs-components-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' }>
                                        <li class="link">
                                            <a href="components/HelpPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HelpPage</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MyApp.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyApp</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' : 'data-target="#xs-injectables-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' : 'id="xs-injectables-links-module-AppModule-bdd8a93320d760ec4cd070aa323faefe"' }>
                                        <li class="link">
                                            <a href="injectables/AppErrorHandlerProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>AppErrorHandlerProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CmeProcessesProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>CmeProcessesProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConfDaysProcessesProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ConfDaysProcessesProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DatabaseProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DatabaseProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SrkServicesProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>SrkServicesProvider</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AttestPageModule.html" data-type="entity-link">AttestPageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AttestPageModule-6da7dd276e911320b17176187fb66109"' : 'data-target="#xs-components-links-module-AttestPageModule-6da7dd276e911320b17176187fb66109"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AttestPageModule-6da7dd276e911320b17176187fb66109"' : 'id="xs-components-links-module-AttestPageModule-6da7dd276e911320b17176187fb66109"' }>
                                        <li class="link">
                                            <a href="components/AttestPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttestPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/CertificateListPageModule.html" data-type="entity-link">CertificateListPageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-CertificateListPageModule-7b788b10eac0c165acc643ab2d91db0c"' : 'data-target="#xs-components-links-module-CertificateListPageModule-7b788b10eac0c165acc643ab2d91db0c"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-CertificateListPageModule-7b788b10eac0c165acc643ab2d91db0c"' : 'id="xs-components-links-module-CertificateListPageModule-7b788b10eac0c165acc643ab2d91db0c"' }>
                                        <li class="link">
                                            <a href="components/CertificateListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">CertificateListPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ComponentsModule.html" data-type="entity-link">ComponentsModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ComponentsModule-797c56338885f5f03906d23d0336875b"' : 'data-target="#xs-components-links-module-ComponentsModule-797c56338885f5f03906d23d0336875b"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ComponentsModule-797c56338885f5f03906d23d0336875b"' : 'id="xs-components-links-module-ComponentsModule-797c56338885f5f03906d23d0336875b"' }>
                                        <li class="link">
                                            <a href="components/DayFourComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DayFourComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/DayOneComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DayOneComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/DayThreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DayThreeComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/DayTwoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DayTwoComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/PofpsCertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PofpsCertComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SummaryComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ConferencePageModule.html" data-type="entity-link">ConferencePageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ConferencePageModule-51c8ddbe2dd59fbc6da2df0b77f2e460"' : 'data-target="#xs-components-links-module-ConferencePageModule-51c8ddbe2dd59fbc6da2df0b77f2e460"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ConferencePageModule-51c8ddbe2dd59fbc6da2df0b77f2e460"' : 'id="xs-components-links-module-ConferencePageModule-51c8ddbe2dd59fbc6da2df0b77f2e460"' }>
                                        <li class="link">
                                            <a href="components/ConferencePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConferencePage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ConferencesPageModule.html" data-type="entity-link">ConferencesPageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ConferencesPageModule-d67eb20c21af41c9b916788f343aeb92"' : 'data-target="#xs-components-links-module-ConferencesPageModule-d67eb20c21af41c9b916788f343aeb92"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ConferencesPageModule-d67eb20c21af41c9b916788f343aeb92"' : 'id="xs-components-links-module-ConferencesPageModule-d67eb20c21af41c9b916788f343aeb92"' }>
                                        <li class="link">
                                            <a href="components/ConferencesPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConferencesPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HomeModule-b1067f99d339e6be2e8af883573679e9"' : 'data-target="#xs-components-links-module-HomeModule-b1067f99d339e6be2e8af883573679e9"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HomeModule-b1067f99d339e6be2e8af883573679e9"' : 'id="xs-components-links-module-HomeModule-b1067f99d339e6be2e8af883573679e9"' }>
                                        <li class="link">
                                            <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ManageDocumentPageModule.html" data-type="entity-link">ManageDocumentPageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ManageDocumentPageModule-b445eaf04c83d318c165197558a3d2b3"' : 'data-target="#xs-components-links-module-ManageDocumentPageModule-b445eaf04c83d318c165197558a3d2b3"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ManageDocumentPageModule-b445eaf04c83d318c165197558a3d2b3"' : 'id="xs-components-links-module-ManageDocumentPageModule-b445eaf04c83d318c165197558a3d2b3"' }>
                                        <li class="link">
                                            <a href="components/ManageDocumentPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageDocumentPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/HoursValidator.html" data-type="entity-link">HoursValidator</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/AppErrorHandlerProvider.html" data-type="entity-link">AppErrorHandlerProvider</a>
                            </li>
                            <li class="link">
                                <a href="injectables/CmeProcessesProvider.html" data-type="entity-link">CmeProcessesProvider</a>
                            </li>
                            <li class="link">
                                <a href="injectables/ConfDaysProcessesProvider.html" data-type="entity-link">ConfDaysProcessesProvider</a>
                            </li>
                            <li class="link">
                                <a href="injectables/DatabaseProvider.html" data-type="entity-link">DatabaseProvider</a>
                            </li>
                            <li class="link">
                                <a href="injectables/MyErrorHandler.html" data-type="entity-link">MyErrorHandler</a>
                            </li>
                            <li class="link">
                                <a href="injectables/SrkServicesProvider.html" data-type="entity-link">SrkServicesProvider</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
