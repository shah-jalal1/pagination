import {
    Box,
    CircularProgress,
    Container,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import { read } from 'fs';
import React, { Component, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';




interface Column {
    id: "title" | "url" | "created_at" | "author",
    label: string,
    minWidth?: number,
    align?: "right"
}

const columns: readonly Column[] = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "url", label: "URL", minWidth: 150 },
    { id: "created_at", label: "Created At", minWidth: 100 },
    { id: "author", label: "Author", minWidth: 100 },
];

export interface InitPost {
    title: string,
    url: string,
    created_at: Date,
    author: string
}

const Home: React.FC = () => {

    const history = useHistory();

    const [pageNo, setPageNo] = useState<number>(0);
    const [localPage, setLocalPage] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [posts, setPosts] = useState<InitPost[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const rowsPerPage = 20;

    useEffect(() => {
        const interval = setInterval(() => {
            setPageNo((_page) => _page + 1);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getPosts();
    }, [pageNo]);

    const getPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNo}`);
            const data = await res.json();
            const _posts = [...posts, ...data?.hits];
            setPosts(_posts);
            setTotalElements(_posts.length);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    const handlePageChange = (e: unknown, newPage: number) => {
        setLocalPage(newPage);
    };

    const handleDetails = (post: InitPost) => {
        history.push("/details", post);
    };

    return (
        <Container data-testid="home">
            <h3 style={{ textAlign: "center" }} data-testid="text">Post Table</h3>
            {loading ? (
                <Box style={{ textAlign: "center" }} data-testid="loading">
                    <CircularProgress size={25} />
                    Loading new Post Data...
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table style={{ minWidth: 650 }} aria-label="simple table"  data-testid="table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, i) => (
                                    <TableCell
                                        key={i}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.id}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {posts
                                .slice(
                                    rowsPerPage * (localPage - 1),
                                    rowsPerPage * (localPage - 1) + rowsPerPage
                                )
                                .map((row) => (
                                    <TableRow
                                        key={row.title}
                                        onClick={() => handleDetails(row)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {row[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Pagination
                count={totalElements / rowsPerPage}
                page={localPage}
                onChange={handlePageChange}
            />
        </Container>
    );
};

//     const history = useHistory();

//     const [page, setPage] = useState<number>(0);

//     const [posts, setPosts] = useState<InitPost[]>([]);

//     const [totalElements, setTotalElements] = useState<number>(0);

//     const [localPage, setLocalPage] = useState<number>(1);

//     const rowsPerPage: number = 20;

//     useEffect(() => {

//         const interval = setInterval(() => {
//             setPage(_page => _page + 1);
//         }, 10000);

//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {

//         getPosts();

//     }, [page])

//     const getPosts = async () => {
//         try {
//             const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`);
//             const data = await res.json();
//             const _posts = [...posts, ...data?.hits];
//             setPosts(_posts);
//             setTotalElements(_posts.length);


//         }
//         catch (error) {

//         }
//     }
//     const getDetails = (post: InitPost) => {
//         history.push({
//             pathname: '/details',
//             state: post
//         })
//     }

//     const handleChangePage = async(event: unknown, newPage: number) => {
//         setLocalPage(newPage);
//     }

//     return (
//         <>
//          <h2>Post List</h2>

// <Container>
//     <Paper>
//         <TableContainer>
//         <Table stickyHeader aria-label="sticky-table">
//             <TableHead>
//             <TableRow>
//                         {
//                             columns.map(column =>
//                                 <TableCell
//                                     key={column.id}
//                                     align={column.align}
//                                     style={{minWidth: column.minWidth}}
//                                 >
//                                     {column.label}
//                                 </TableCell>
//                             )
//                         }
//                     </TableRow>
//             </TableHead>

//             <TableBody>
//                 {
//                     posts
//                     .slice((localPage -1) * rowsPerPage, (localPage-1) * rowsPerPage + rowsPerPage)
//                     .map((row, index) => {
//                         return(
//                             <TableRow 
//                             key={index}
//                             onClick={()=> getDetails(row)}>
//                                 {
//                                     columns.map(column => {
//                                         const value = row[column.id];
//                                         return(
//                                             <TableCell
//                                             key={column.id}>
//                                                 {value}
//                                             </TableCell>
//                                         )
//                                     })
//                                 }

//                             </TableRow>
//                         )
//                     })
//                 }
//             </TableBody>
//         </Table>
//         </TableContainer>

//          <Pagination

//                 count={totalElements / rowsPerPage}
//                 page={localPage}
//                 onChange={handleChangePage}

//             />

//     </Paper>
// </Container>
//         </>
//     );
// };

export default Home;