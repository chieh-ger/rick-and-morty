import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Avatar,
    Grid,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Snackbar
} from '@material-ui/core';
import { ICharacterInfo } from '../../types';

const InfoModalComponent: React.FC<ICharacterInfo> = ({
    characterInfo,
    open,
    episodeList,
    onModalClose
}) => {
    const [rows, setRows] = useState<any>([]);
    const [selectedMerch, setSelectedMerch] = useState(characterInfo?.name);
    const [buyMerch, setBuyMerch] = useState(false);
    const columns = [
        { id: 'name', label: 'Episode Name' },
        { id: 'id', label: 'Episode Number' },
        { id: 'air_date', label: 'Date Aired' },
        { id: 'episode', label: 'Season + Ep' }
    ]

    // Populating episode/s information based on appearance of the character in question.
    const populateRows = () => {
        let populatedRows = [];
        for (let characterEp of characterInfo?.episode) {
            for (let epDetail of episodeList) {
                if (epDetail.id.toString() === characterEp.split('/').pop()) {
                    populatedRows.push({ id: epDetail.id, name: epDetail.name, air_date: epDetail.air_date, episode: epDetail.episode });
                    break;
                }
            }
        }
        setRows(populatedRows);
    }

    // For auto closing of the snackbar
    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setBuyMerch(false);
    };

    useEffect(() => {
        populateRows();
    }, [])

    return (
        <>
            <Dialog
                open={open}
                onClose={onModalClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    <Avatar src={characterInfo?.image} alt={characterInfo?.name} />
                    {characterInfo?.name}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <p><b>Status: </b><br />{characterInfo?.status}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p><b>Species: </b><br /> {characterInfo?.species}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p><b>Type: </b><br /> {characterInfo?.type ? characterInfo.type : 'Unknown'}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p><b>Gender:  </b><br /> {characterInfo?.gender}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p><b>Origin: </b><br /> {characterInfo?.origin.name}</p>
                        </Grid>
                        <Grid item xs={6}>
                            <p><b>Last Location:  </b><br /> {characterInfo?.location.name}</p>

                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TableContainer style={{ maxHeight: '400' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    style={{ background: 'orange', color: '#fff' }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row: any) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onModalClose} color="secondary" variant="contained">
                        Close
                </Button>
                    <Button onClick={() => setBuyMerch(true)} color="primary" variant="contained">
                        Buy Merchandise
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={buyMerch}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div className="info">
                    Merchandise "{selectedMerch}" was clicked!
                </div>
            </Snackbar>
        </>
    )
}

export default InfoModalComponent;