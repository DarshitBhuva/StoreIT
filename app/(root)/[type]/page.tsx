import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.action';
import { convertFileSize, getFileTypesParams } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react'

const Page = async ({ params, searchParams }: SearchParamProps) => {

    const type = (await params)?.type as string || "";
    const types = getFileTypesParams(type) as FileType[];
    const searchText = ((await searchParams)?.query as string) || '';
    const sort = ((await searchParams)?.sort as string) || '';

    const files = await getFiles({types, searchText, sort});
    
    const catculateTotalSpace = ()=>{
        let totalSpace = 0;
        files.documents.forEach((file : Models.Document) => {
            totalSpace += file.size;
        });

       return convertFileSize(totalSpace);
    }

    return (
        <div className='page-container'>
            <section className='w-full'>
                <h1 className='h1 capitalize'>{type}</h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Total : <span className='h5'>{catculateTotalSpace()}</span>
                    </p>

                    <div className="sort-container">
                        <p className='body-1 hidden sm:block text-light-200'>Sort by: </p>
                        <Sort />
                    </div>
                </div>
            </section>

            {/* render files  */}
            {files.total > 0 ? (<section className='file-list'>

                {files.documents.map((file: Models.Document) => (<Card key={file.$id} file={file}/>))}

            </section>) : <p> No files uploaded</p>}
        </div>
    )
}

export default Page;
