// PaperCard.js
import React from 'react';
import { Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Box } from '@mui/system';

const PaperCard = ({ paper, onSave, onDelete, isSaved, showRemoveButton }) => (
    <Card 
        variant="outlined" 
        sx={{ 
            boxShadow: 3, 
            borderRadius: 3, 
            position: 'relative', 
            overflow: 'hidden',
        }}
    >
        {!showRemoveButton && (
            <IconButton 
                sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                }} 
                onClick={isSaved ? () => onDelete(paper) : () => onSave(paper)}
            >
                {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </IconButton>
        )}

        <CardContent sx={{ paddingBottom: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>{paper.title}</Typography>
            <Typography color="textSecondary" sx={{ mb: 1 }}>{paper.authors} ({paper.year})</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>Citations: {paper.citations}</Typography>
        </CardContent>
    </Card>
);

export default PaperCard;
