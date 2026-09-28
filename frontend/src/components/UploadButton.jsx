"use client";
import { Box } from "@mui/material";

import { CurtainsSharp } from "@mui/icons-material";
import { CldUploadButton} from "next-cloudinary";

function UploadButton(props) {

    return (
        <Box sx={{width: "100%", height: "100%"}}>
            <CldUploadButton {...props}  style={{height: "50px", width: "100%", cursor: "pointer", backgroundColor: "#c9cedb88"}}/>
        </Box>
    )

}

export default UploadButton;