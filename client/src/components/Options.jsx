import React, { useContext, useState } from "react";
import { Button, TextField, Grid, Typography, Container, Paper, makeStyles } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@material-ui/icons";
import { SocketContext } from "../socketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    border: "2px solid black",
  },
}));

export const Options = ({ children }) => {
  const classes = useStyles();
  const { id, callAccepted, name, setName, leaveCall, callUser, callEnded } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={10}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid className={classes.padding} item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Account Info
              </Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <CopyToClipboard text={id} className={classes.margin}>
                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                  Copy your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid className={classes.padding} item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Make a call
              </Typography>
              <TextField label="Id to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<PhoneDisabled fontSize="large" />}
                  onClick={leaveCall}
                  className={classes.margin}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Phone fontSize="large" />}
                  onClick={() => callUser(idToCall)}
                  className={classes.margin}
                >
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};
