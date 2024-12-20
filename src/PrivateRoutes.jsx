import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import errorData from './lotties/error.json';
import { auth } from './firebase';

//general
import PrivateRoute from './components/PrivateRoute';
import Settings from './screens/settings/Settings';
import UsageBilling from './screens/settings/UsageBilling';
import SettingsColletions from './screens/settings/SettingsCollections';
import SettingsTeam from './screens/settings/SettingsTeam';
import SettingsEmails from './screens/settings/SettingsEmails';
import ElementDetails from './screens/mainPages/ElementDetails';
import ModuleList from './screens/mainPages/ModuleList';
import NodeMaster from './screens/specific/NodeMaster';
import Node from './screens/specific/Node';
import Emails from './screens/specific/Emails';
import Dashboard from './screens/mainPages/Dashboard';
import EmailsCreator from './screens/website/EmailsCreator';
import SettingsLocations from './screens/settings/SettingsLocations';
import ListDrop from './screens/lists/ListDrop';
import Inbox from './screens/mainPages/Inbox';
import Supports from './screens/specific/Supports';
import LP from './screens/specific/LP';
import Marketplace from './screens/specific/Marketplace';
import FrameWeb from './screens/mainPages/FrameWeb';
import Tickets from './screens/specific/Tickets';
import TicketsNode from './screens/specific/TicketsNode';
import HelpCenter from './screens/specific/HelpCenter';
import Scheduled from './screens/specific/Scheduled';
import OverviewFlows from './screens/specific/OverviewFlows';
import JcraquePourToiMonCoco from './sandbox/JcraquePourToiMonCoco';
import JcraqueInterieurementPourToiMonCoco from './sandbox/JcraqueInterieurementPourToiMonCoco';

const PrivateRoutes = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: errorData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Routes>
      <Route
        path="/sandbox"
        element={
          <PrivateRoute
            permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER', 'PERSONAL']}
          >
            <JcraqueInterieurementPourToiMonCoco />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER', 'PERSONAL']}
          >
            <Dashboard />
          </PrivateRoute>
        }
      />
      [///////////////////////// General //////////////////////////]
      <Route
        path="/:collection/:moduleName/:moduleId/:structureId"
        element={
          <PrivateRoute permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER']}>
            <ModuleList />
          </PrivateRoute>
        }
      />
      <Route
        path="/:collection/:moduleName/:moduleId/:structureId/:segmentId"
        element={
          <PrivateRoute permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER']}>
            <ModuleList />
          </PrivateRoute>
        }
      />
      <Route
        path="/element/:moduleName/:structureId/:elementId"
        element={
          <PrivateRoute permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER']}>
            <ElementDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/nodes/:nodeId"
        element={
          <PrivateRoute permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER']}>
            <ListDrop />
          </PrivateRoute>
        }
      />
      <Route
        path="/flows"
        element={
          <PrivateRoute permission={['ADMIN', 'MANAGER', 'STANDARD', 'OWNER']}>
            <OverviewFlows />
          </PrivateRoute>
        }
      />
      [///////////////////////// Finances //////////////////////////]
      <Route
        path="/mynode/master"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <NodeMaster />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/tickets"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Tickets />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/supportNode"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <TicketsNode />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/helpcenter"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <HelpCenter />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/helpcenter/:contentId"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <HelpCenter />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/scheduled"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Scheduled />
          </PrivateRoute>
        }
      />
      <Route
        path="/node/emails"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Emails />
          </PrivateRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Inbox />
          </PrivateRoute>
        }
      />
      <Route
        path="/tools/support"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Supports />
          </PrivateRoute>
        }
      />
      <Route
        path="/tools/lp/:docId"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <LP />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/locations"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <SettingsLocations />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/page"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Node />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/preferences"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Node />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/usage"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <UsageBilling />
          </PrivateRoute>
        }
      />
      <Route
        path="/mynode/marketplace"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Marketplace />
          </PrivateRoute>
        }
      />
      <Route
        path="/links/:linkIndex"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <FrameWeb />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/structures"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <SettingsColletions />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/team"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <SettingsTeam />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings/emails"
        element={
          <PrivateRoute permission={['ADMIN', 'OWNER']}>
            <SettingsEmails />
          </PrivateRoute>
        }
      />
      [///////////////////////// Extensions //////////////////////////]
      <Route path="/tools/redactor" element={<EmailsCreator />} />
    </Routes>
  );
};

export default PrivateRoutes;
