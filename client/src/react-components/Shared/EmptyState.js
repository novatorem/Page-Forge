import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import TodayIcon from "@mui/icons-material/Today";
import NumbersIcon from "@mui/icons-material/Numbers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { setState } from "../../store";

const features = [
  { icon: <EditNoteIcon />, label: "{_}", description: "Text input field" },
  { icon: <ToggleOnIcon />, label: "{this/that}", description: "Dropdown selector" },
  { icon: <TodayIcon />, label: "{date}", description: "Date picker" },
  { icon: <NumbersIcon />, label: "{#}", description: "Number input" },
  { icon: <CheckBoxOutlineBlankIcon />, label: "{?:text}", description: "Optional text" },
  { icon: <FormatListBulletedIcon />, label: "{*}", description: "Paragraph picker" }
];

const centerBox = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  px: 4,
  textAlign: "center"
};

export default function EmptyState(props) {
  const handleNew = () => {
    setState("pageTitle", "");
    setState("newPage", true);
  };

  if (props.userPages?.length > 0) {
    return (
      <Box sx={centerBox}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ animation: "fade-slide-up 250ms var(--ease-out-quart) both" }}
        >
          Select a page from the sidebar to get started.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNew}
          sx={{ animation: "fade-slide-up 250ms var(--ease-out-quart) 60ms both" }}
        >
          New page
        </Button>
      </Box>
    );
  }

  // New user: full onboarding with feature reference
  return (
    <Box sx={{ ...centerBox, gap: 3 }}>
      <Box sx={{ animation: "fade-slide-up 350ms var(--ease-out-quart) both" }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Page Forge
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          Write your template once - fill it in every time.
        </Typography>
      </Box>

      <Divider sx={{ width: "100%", maxWidth: 480, animation: "fade-slide-up 350ms var(--ease-out-quart) 60ms both" }} />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {features.map((f, index) => (
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
              minWidth: 120,
              animation: "scale-in 300ms var(--ease-out-quart) both",
              animationDelay: `${100 + index * 45}ms`
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

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", animation: "fade-slide-up 350ms var(--ease-out-quart) 380ms both" }}>
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
    </Box>
  );
}
