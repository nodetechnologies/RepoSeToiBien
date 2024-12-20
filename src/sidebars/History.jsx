import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//components
import Drawer from '@mui/material/Drawer';
import { Typography } from '@mui/material';

const History = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const mode = localStorage.getItem('mode') || 'light';
  const businessPreference = useSelector((state) => state.core.businessData);
  const history = localStorage.getItem('history')
    ? JSON.parse(localStorage.getItem('history'))
    : [];

  const filtredHistory = history.filter(
    (loc) => loc.businessId === businessPreference?.id
  );

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={closeSidebar}
      sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ width: 750 }} className="p-4">
        {filtredHistory?.length > 0 &&
          filtredHistory?.map((loc, index) => (
            <div key={index} className="p-2">
              <div
                style={{
                  width: '100%',
                  backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f7f7f7',
                  borderRadius: '10px',
                }}
                onClick={() => {
                  closeSidebar();
                  navigate(loc?.pathname);
                }}
                className="d-flex justify-content-between hover p-3"
              >
                <div>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    fontSize="12px"
                    style={{ color: mode === 'dark' ? '#fff' : '#000' }}
                  >
                    {loc?.name}
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={400}
                    fontSize="11px"
                    style={{
                      color: mode === 'dark' ? '#ffffff60' : '#00000060',
                    }}
                  >
                    {loc?.moduleName}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="body2"
                    fontWeight={300}
                    fontSize="10px"
                    style={{ color: mode === 'dark' ? '#fff' : '#000' }}
                  >
                    {loc?.timeStamp}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Drawer>
  );
};

export default History;
