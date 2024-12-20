import { Route, Routes } from 'react-router-dom';

import NotFound from './screens/UX/NotFound';

import HomePage from './screens/website/HomePage';
import LegalTerms from './screens/website/LegalTerms';
import HelpApp from './screens/website/HelpApp';
import PlanDemo from './screens/website/PlanDemo';
import PageContent from './screens/website/PageContent';
import ModuleContent from './screens/website/ModuleContent';
import TipsContent from './screens/website/TipsContent';
import Portal from './screens/website/Portal';
import ToolsContent from './screens/website/ToolsContent';
import ModulesPage from './screens/website/ModulesPage';
import PublicInvoice from './screens/public/PublicInvoice';
import PublicElement from './screens/public/PublicElement';
import PublicElementRedirect from './screens/public/PublicElementRedirect';
import PublicProject from './screens/public/PublicProject';
import Welcome from './screens/public/Welcome';
import Presentation from './screens/public/Presentation';
import BusinessPage from './screens/website/BusinessPage';
import Oauth from './screens/UX/Oauth';
import SupportContent from './screens/website/SupportContent';
import PublicProfile from './screens/website/PublicProfile';
import Onboard from './screens/website/Onboard';
import Usecases from './screens/website/Usecases';
import StructurePublic from './screens/public/StructurePublic';
import PriceSimulator from './websiteV2/components/PriceSimulator';
import OnboardSuccess from './screens/website/OnboardSuccess';
import GamePlay from './screens/website/GamePlay';
import ColorGen from './stories/layout-components/templates/ColorGen';
import Event from './screens/website/Event';
import PublicNPS from './screens/public/PublicNPS';
import Home from './websiteV2/screens/Home';
import Features from './websiteV2/screens/Features';
import Integrations from './websiteV2/screens/Integrations';
import Pricing from './websiteV2/screens/Pricing';
import Contact from './websiteV2/screens/Contact';
import JcraquePourToiMonCoco from './sandbox/JcraquePourToiMonCoco';

const PublicRoutes = () => {
  return (
    <>
      {' '}
      <Routes>
        <Route path="/sandbox" element={<JcraquePourToiMonCoco />} />
        <Route path="/comprendre-node" element={<HomePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/color-gen" element={<ColorGen />} />
        <Route path="/informations/mentions-legales" element={<LegalTerms />} />
        <Route path="/card/:domain/:elementId" element={<PublicInvoice />} />
        <Route
          path="/public/:structureId/:elementId"
          element={<PublicElement />}
        />
        <Route
          path="/doc/:businessId/:moduleName/:structureId/:elementId"
          element={<PublicElement />}
        />
        <Route
          path="/redirect/:businessId/:moduleName/:structureId/:elementId"
          element={<PublicElementRedirect />}
        />
        <Route
          path="/redirect/element/:elementId"
          element={<PublicProject />}
        />
        <Route path="/nps/:elementType/:elementId" element={<PublicNPS />} />
        <Route path="/welcome/:businessId" element={<Welcome />} />
        <Route
          path="/card-user-public/:elementId"
          element={<PublicInvoice />}
        />
        <Route
          path="/card-project/:domain/:elementId"
          element={<PublicProject />}
        />
        <Route path="/oauth/exchange" element={<Oauth />} />
        <Route path="/page/:businessId" element={<BusinessPage />} />
        <Route
          path="/profile/:userId/:businessId"
          element={<PublicProfile />}
        />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/event" element={<Event />} />
        <Route path="/onboard-success" element={<OnboardSuccess />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/functions/:contentName" element={<PageContent />} />
        <Route path="/tools/:contentName" element={<ToolsContent />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pricing/simulator" element={<PriceSimulator />} />
        <Route path="/modules/:contentName" element={<ModuleContent />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/tips/:contentName" element={<TipsContent />} />
        <Route path="/play/:gameId" element={<GamePlay />} />
        <Route path="/meet-node" element={<PlanDemo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/use-cases" element={<Usecases />} />
        <Route path="/help/app" element={<HelpApp />} />
        <Route path="/help/app/:contentId" element={<SupportContent />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/structure-public" element={<StructurePublic />} />
      </Routes>
    </>
  );
};

export default PublicRoutes;
