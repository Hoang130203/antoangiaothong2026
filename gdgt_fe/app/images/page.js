'use client'
import { useEffect, useState } from 'react';
import imageData from '../../data/images.json'
import { Button, Grid } from '@mui/material';
import Api from '../api/api';
function Images() {
    const [file, setFile] = useState()
    const [imageUrls, setImageUrls] = useState([]);
    const [loaded, setLoaded] = useState(false)
    try {
        var isAdmin = localStorage.getItem('account') == 'admin' ? true : false;
        var userId = localStorage.getItem('info')
    } catch (error) {
        console.error('Error fetching image data:', error);
    }
    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     const imageData = { imageUrl, timestamp };

    //     try {
    //         const response = await fetch('/api/image', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(imageData),
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //     } catch (error) {
    //         console.error('Error saving image data:', error);
    //     }
    // };
    const handleChangFile = async (event) => {
        const selectedFile = event.target.files[0]
        setFile(event.target.files[0])
    }

    useEffect(() => {
        Api.getImages().then((response) => {
            setImageUrls(response.data)
            setLoaded(true)
        }).catch((error) => {
            console.log(error)
        }
        )
    }, [])
    const handlePostImage = async () => {
        if (file) {
            await Api.PostImage(file).then((response) => {
                console.log(response)
                Api.insertImage(response.data.url, userId).then((response) => {
                    if (response.status == 200) {
                        window.location.reload()
                        alert('Thêm ảnh thành công')
                    }
                }).catch((error) => {
                    alert('Thêm ảnh thất bại')
                    console.log(error)
                })
            }).catch((error) => {
                alert('Thêm ảnh thất bại')
                console.log(error)
            })
        }
    }
    // <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
    // <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="Timestamp" />
    // <button type="submit">Save Image</button>
    return (
        <div style={{ paddingTop: '10px', minHeight: '800px' }}>
            <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                <div className="loader_" ></div>
            </div>
            {isAdmin &&
                <div style={{ marginLeft: '20px' }}>
                    <input type="file" onChange={handleChangFile} ></input>
                    <Button onClick={handlePostImage} variant='contained' style={{ margin: '20px' }}>Thêm ảnh</Button>
                </div>
            }
            <Grid container item xs={12} padding='0px 15px' >
                {imageUrls.map((image, index) => (
                    <Grid item xs={12} md={4} key={index} padding='10px 5px' borderRadius='20px' maxHeight='400px' overflow='hidden'>
                        <img src={image.url} alt="Image" style={{ width: '100%', borderRadius: '20px' }} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Images;