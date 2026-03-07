import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { setState } from "../../store";

const features = [
  { icon: <EditNoteIcon />, label: "{_}", description: "Text input field" },
  { icon: <ToggleOnIcon />, label: "{this/that}", description: "Dropdown selector" },
  { icon: <FormatListBulletedIcon />, label: "{*}", description: "Paragraph picker" }
];

export default function EmptyState(props) {
  const handleNew = () => {
    setState("coverTitle", "");
    setState("newCover", true);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 4,
        textAlign: "center"
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} color="primary">
          Page Forge
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          Write your template once - fill it in every time.
        </Typography>
      </Box>

      <Divider sx={{ width: "100%", maxWidth: 480 }} />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {features.map(f => (
          <Box
            key={f.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
              minWidth: 120
            }}
          >
            <Box color="primary.main">{f.icon}</Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {f.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {f.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNew}
        >
          New page
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setState("info", true)}
        >
          Syntax guide
        </Button>
      </Box>

      {props.userCovers?.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          Select a page from the sidebar to get started.
        </Typography>
      )}
    </Box>
  );
}
