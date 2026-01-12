export const pagination = (limit:number,page:number,count:number)=>{
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    return {
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        limit,
        count
    }
}