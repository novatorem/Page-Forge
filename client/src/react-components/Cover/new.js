import { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setState, useAppStore } from "../../store";
import { newCover } from "../../actions/cover";
import { autoHide } from "../../actions/helpers";

import "./styles.css";

const TEMPLATES = [
  {
    title: "Cover Letter",
    data: `{date}

Dear {_},

I am writing to express my strong interest in the {_} position at {_}. I came across this opportunity {on your website/through LinkedIn/on Indeed/via a referral}, and I believe my background makes me an excellent fit for your team.

{*}

Over the past {#} years, I have built expertise in {_}, with a particular focus on {_}. I am drawn to {_} because of its commitment to {_}, and I am confident I can contribute meaningfully from day one.

{?:I am available to start immediately.}

Thank you for considering my application. I would welcome the chance to discuss this role further at your convenience.

Sincerely,
{_}

{Accomplishments|During my time at my previous role, I led a cross-functional initiative that resulted in a measurable improvement in team efficiency and directly supported the organization's broader strategic goals.}
{Culture Fit|I am drawn to collaborative, mission-driven environments where curiosity and continuous learning are valued. I believe I would thrive within your culture and contribute positively to the team dynamic.}
{Technical Strength|My hands-on experience with industry tools and my commitment to staying current with best practices allow me to hit the ground running and deliver high-quality work consistently.}`
  },
  {
    title: "Cold-Call Email",
    data: `Subject: {_}

Hi {_},

My name is {_} from {_}. I came across {_} and wanted to reach out directly.

We help {businesses/teams/companies} {save time and reduce costs/scale faster/improve their workflow/increase revenue} with {_}, and based on what I know about {_}, I think there could be a strong fit.

{*}

{?:We have worked with over {#} companies in your space and have seen consistent results within the first 90 days.}

Would you be open to a quick {10-minute/15-minute/30-minute} call {this week/next week/at your convenience} to explore this?

Best,
{_}
{_} | {_}
{_}

{Value Proposition|Our solution has helped similar companies reduce operational overhead significantly, freeing their teams to focus on higher-impact work. I'd love to walk you through a quick example relevant to your industry.}
{Social Proof|We work with a number of companies in your space and have consistently delivered measurable results within the first 90 days of engagement.}
{Low-Pressure Close|There is no obligation - just a quick conversation to see if what we do is relevant to where you are headed. If it is not a fit, I will say so.}`
  },
  {
    title: "Interview Follow-Up",
    data: `{date}

Subject: Thank You - {_} Interview

Dear {_},

Thank you for taking the time to speak with me {today/yesterday} about the {_} role at {_}. I genuinely enjoyed our conversation and came away even more excited about the opportunity.

{*}

I remain very enthusiastic about joining {_} and feel confident that my {#} years of experience in {_} would allow me to contribute effectively to your team's goals.

{?:As discussed, I am happy to provide references or a portfolio sample upon request.}

Please feel free to reach out if there is any additional information I can provide. I look forward to hearing from you.

Best regards,
{_}

{Specific Moment|One part of our conversation that stood out was the discussion around the team's upcoming priorities. It reinforced that this is exactly the kind of challenge I am looking for, and one where I believe I can make a real impact.}
{Reiterate Interest|The more I learn about the role and the company, the more confident I am that this would be a strong mutual fit. I am genuinely excited about the direction your team is headed.}`
  }
];

export default function NewCover() {
  const externalOpen = useAppStore(s => s.newCover);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      setState("newCover", false);
    }
  }, [externalOpen]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setSelectedTemplate(null);
    setOpen(false);
  };

  const handleCreate = () => {
    if (name.length < 1 || name.length > 200) {
      setState("coverShort", true);
      autoHide("coverShort");
      return;
    }
    newCover(name, selectedTemplate?.data || "");
    handleClose();
  };

  return (
    <>
      <div className="newCover">
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="new-dialog-title">
        <DialogTitle id="new-dialog-title">New Page</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, mb: 0.75, display: "block" }}>
            Start from a template (optional)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {TEMPLATES.map(t => {
              const selected = selectedTemplate?.title === t.title;
              return (
                <Box
                  key={t.title}
                  onClick={() => setSelectedTemplate(selected ? null : t)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    border: 2,
                    borderColor: selected ? "primary.main" : "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: "0.8rem",
                    color: selected ? "primary.main" : "text.secondary",
                    "&:hover": { borderColor: "primary.main", color: "primary.main" }
                  }}
                >
                  {t.title}
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
