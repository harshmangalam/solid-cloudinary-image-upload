import { ThemeProvider } from "@suid/material";
import Alert from "@suid/material/Alert";
import Button from "@suid/material/Button";
import Card from "@suid/material/Card";
import CardActions from "@suid/material/CardActions";
import CardMedia from "@suid/material/CardMedia";
import Container from "@suid/material/Container";
import Grid from "@suid/material/Grid";
import LinearProgress from "@suid/material/LinearProgress";
import Stack from "@suid/material/Stack";
import { Show } from "solid-js";
import useCloudinary from "./hooks/useCloudinary";

function App() {
  let fileInputRef = null;
  const {
    store,
    handleImageChange,
    handleImageRemove,
    handleImageUpload,
    handleCancelUpload,
  } = useCloudinary();
  return (
    <ThemeProvider>
      <Container>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={6} xs={12}>
            <Show when={store.alert}>
              <Alert sx={{ mt: 4, mb: 4 }} severity={store.alert.severity}>
                {store.alert.text}
              </Alert>
            </Show>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button
              onClick={() => fileInputRef.click()}
              variant="contained"
              size="large"
            >
              Select Image
            </Button>

            <Show when={store.uploadProgress}>
              <Stack direction={"column"} spacing={2}>
                <LinearProgress
                  sx={{ mt: 4 }}
                  variant="determinate"
                  value={store.uploadProgress}
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
              </Stack>
            </Show>

            <Show when={store.imagePreview}>
              <Card sx={{ mt: 4 }}>
                <CardMedia
                  component="img"
                  height="600px"
                  image={store.imagePreview}
                  alt="Image Preview"
                />

                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleImageRemove}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleImageUpload}
                  >
                    Upload
                  </Button>
                </CardActions>
              </Card>
            </Show>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
