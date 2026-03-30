import { Button, TextField, Typography } from '@mui/material';
import styles from './exam.module.css';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import Api from '../api/api';
function AddExam({ handleClose }) {
    const [name, setName] = useState('');
    const [max, setMax] = useState('');
    const [time, setTime] = useState('');
    const [data, setData] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            setData(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            // console.log(data);
        };

        reader.readAsBinaryString(file);
    };
    const handleDivClick = (event) => {
        event.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    };
    console.log(data)
    const handleAddExam = async () => {
        await setIsDisabled(true)
        let exam = []
        for (let i = 2; i < data.length; i++) {
            let answer = data[i][5].toUpperCase()
            let answer_ = (answer == 'A' ? 1 : answer == 'B' ? 2 : answer == 'C' ? 3 : 4)
            let question = { question: data[i][0], choice1: data[i][1], choice2: data[i][2], choice3: data[i][3], choice4: data[i][4] + '', answer: answer_ + '' }
            await exam.push(question)
        }
        console.log(exam)
        await Api.postExam(name, parseInt(time), parseInt(max), exam).then(res => {
            if (res.status == 200) {
                alert('Thêm thành công')
            }
            console.log(res.data)

        }
        )
    }
    return (
        <div onClick={handleClose} style={{ zIndex: '9', backgroundColor: 'rgb(238 237 237 / 53%)', width: '100vw', height: '100vh', position: 'fixed', top: '0px', left: '0px' }}>
            <div onClick={handleDivClick} className={styles.form_exam}>
                <div>
                    <Typography variant='h5'>Thông tin cuộc thi</Typography>
                </div>
                <div style={{ padding: '3px 0px' }}>
                    <TextField value={name} onChange={(e) => { setName(e.target.value) }} id='name' label="Tên cuộc thi" variant="outlined" style={{ width: '80%', }} />
                </div>
                <div>
                    <TextField value={max} onChange={(e) => { setMax(e.target.value) }} label='Số lần làm tối đa' variant="outlined" style={{ padding: '3px 0px', marginRight: '6px' }} />
                    <TextField value={time} onChange={(e) => { setTime(e.target.value) }} label='Thời gian làm bài (phút)' variant="outlined" style={{ padding: '3px 0px' }} />
                </div>
                <Typography variant='h5' fontStyle='inherit'>Nhập file đề thi</Typography>
                <div style={{ padding: '5px 0px' }}>
                    <input onChange={handleFileChange} type='file' accept='.xlsx' />
                </div>

                <Button disabled={isDisabled} onClick={handleAddExam} variant='contained' className={styles.button_add_exam}>Thêm</Button>
                <div style={{ maxWidth: '100%', maxHeight: '300px', overflow: 'auto' }}>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AddExam;