import React from 'react';

//utilities
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';

//components
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

  const ScheduleLocations = () => {
  return (
    <div>
      <div>
        <List dense>
          <ListItem dense button divider>
            <ListItemText primary="Terrain A" />
            <ListItemIcon>
              <PriceChangeOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <PermMediaOutlinedIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button divider>
            <ListItemText primary="Terrain B" />
            <ListItemIcon>
              <PriceChangeOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <PermMediaOutlinedIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button divider>
            <ListItemText primary="Terrain C" />
            <ListItemIcon>
              <PriceChangeOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <PermMediaOutlinedIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button divider>
            <ListItemText primary="Chalet Laberge" />
            <ListItemIcon>
              <PriceChangeOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <PermMediaOutlinedIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button divider>
            <ListItemText primary="Chalet Dupont" />
            <ListItemIcon>
              <PriceChangeOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemIcon>
              <PermMediaOutlinedIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </div>
  );
};
export default ScheduleLocations;
