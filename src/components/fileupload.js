import React, { Fragment, useState } from 'react'
import Message from './message'
import axios from 'axios';
import Progress from 'react-progressbar';


const Fileupload = (props)=>{

    const [file,setFile] = useState('');
    const [filename,setFilename] = useState('Choose File');
    const [uploadedFile,setUploadedFile] = useState({});
    const [message,setMessage]=useState('');
    const [uploadPercentage,setUploadPercentage]=useState(0);

    const onChange = e =>{
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = e =>{
        e.preventDefault();
        const formData= new FormData(document.getElementById('newpackageform'));
        formData.append('name', document.getElementById('packagename').value);
        formData.append('description',document.getElementById('description').value);
        formData.append('coordinates',document.getElementById('latitude').value);
        formData.append('coordinates',document.getElementById('longitude').value);
        formData.append('images',uploadedFile.filePath);
        try{
             axios.post('/admin/addpackage',formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Package Added');

        } catch(err){
            if(err.response.status === 500){
                setMessage("there was a problem with server");
            }
            else{
                setMessage(err.response.data.msg);
            }

        }


    }

    const onUpload =async e =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('file',file);

        try{
            const res = await axios.post('/admin/upload',formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress : ProgressEvent =>{
                    setUploadPercentage(parseInt(Math.round((ProgressEvent.loaded *100*2)/ProgressEvent.total)));

                    // clear percentage
                    setTimeout(() => setUploadPercentage(0),10000);
                }

            });

            const {fileName ,filePath} = res.data;
            console.log(res.data);
            setUploadedFile({fileName,filePath});
            setMessage('File uploaded');

        } catch(err){
            if(err.response.status === 500){
                setMessage("there was a problem with server");
            }
            else{
                setMessage(err.response.data.msg);
            }

        }
    }
    
    return(
        <Fragment>
        <h1>Admin Panel</h1>
            {message ? <Message msg={message}/> : null}

            <form onSubmit={onSubmit} id="newpackageform">
                <div className="container">
                <h2> Add a Package</h2>
                <hr></hr>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Package Name</label>
                    <input type="text" className="form-control" id="packagename"  placeholder="Enter package name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" className="form-control" id="description" placeholder="Description"/>
                </div>
                <div className="coordinates">
                <label>Coordinates</label>
                <div className="row">
                    <div className="form-group" className="col-md-6">
                        <input type="text" className="form-control" id="latitude" placeholder="Latitude"/>
                    </div>
                    <div className="form-group" className="col-md-6">
                        <input type="text" className="form-control" id="longitude" placeholder="Longitude"/>
                    </div>
                </div>
                </div>

                    <div className="custom-file" className="form-group">
                        <input type="file" className="custom-file-input" id="customFile" name="file" onChange={onChange}/>
                        <label className="custom-file-label" htmlFor="customFile">
                            {filename}
                        </label>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                         <Progress completed={uploadPercentage} />
                            
                        
                        </div>
                        <div className="col-md-6">
                            <button type="button" onClick={onUpload} className="btn btn-primary upload-btn">Upload</button>
                        </div>
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary btn-block mt-4" className="submit-btn"/>

                { uploadedFile ? <div className="row mt-5">
                    <div className="col-md-6 m-auto">
                    </div>

                    </div> : null }
            </div>
            </form>

            
        </Fragment>
    )
}

export default Fileupload;