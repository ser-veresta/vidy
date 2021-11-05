import React, { useContext } from "react";
import { Grid, Paper, Typography, makeStyles } from "@material-ui/core";

import { SocketContext } from "../socketContext";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

export const VideoPlayer = () => {
  const { name, callAccepted, myRef, userRef, callEnded, stream, call } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid xs={12} md={6} item>
            <Typography variant="h5" gutterBottom>
              {name || "Untitled"}
            </Typography>
            <video playsInline muted ref={myRef} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid xs={12} md={6} item>
            <Typography variant="h5" gutterBottom>
              {call.name || "Untitled"}
            </Typography>
            <video playsInline ref={userRef} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};
