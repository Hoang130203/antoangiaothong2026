'use client'
import { useEffect, useState } from 'react';
import styles from './exam.module.css'
import Api from '../api/api';
function Rank({ id }) {
    const [rank, setRank] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        Api.getRank(id).then(res => {
            setRank(res.data)
            setLoaded(true)
        }).catch(err => console.log(err))
        console.log(id)
    }, [])
    return (
        <div>
            <div style={{ display: `${loaded ? 'none' : 'fixed'}` }} className="loader_container">
                <div className="loader_" ></div>
            </div>
            <div className={styles.form_exam}>
                <h1>Xếp hạng bài thi </h1>
                <div style={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
                    <table>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Họ tên</th>
                            <th>Kết quả</th>
                            <th>Thời gian(s)</th>
                        </tr>
                        {rank.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.result?.numberCorrect}/{item?.result?.totalQuestion}</td>
                                    <td>{item?.result?.time}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Rank;