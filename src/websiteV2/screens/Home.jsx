import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../SiteLayout';
import HeaderSection from './lpSections/Header';
import MapSection from './lpSections/Map';
import ProbsFixSection from './lpSections/ProbsFix';
import { useTranslation } from 'react-i18next';
import IndustrySection from './lpSections/Industry';
import LastLpSection from './lpSections/LastLp';
import Intro from './lpSections/Intro';
import MissionSection from './lpSections/Mission';
import Btn from '../components/Btn';

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <SiteLayout
      helmetData={{
        name: t('home'),
        description: t('homeDesc'),
      }}
    >
      <HeaderSection />
      <Intro />
      <MapSection />
      <MissionSection />
      <ProbsFixSection />
      <LastLpSection />
      <IndustrySection />
      <div
        className="row align-c block-separator"
        style={{ marginBottom: '100px' }}
      >
        <Btn
          text={t('Sintegrations')}
          onClick={() => navigate('/integrations')}
        />
      </div>
    </SiteLayout>
  );
};

export default Home;
