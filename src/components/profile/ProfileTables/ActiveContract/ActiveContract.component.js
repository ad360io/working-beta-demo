/*
Core Libs
*/
import React from 'react';

/**
 * Active Contract Component
 * @param {string} listingType passed as props to decide the label
 */
const ActiveContract = ({listingType}) => (
    <div className='active-contract-container'>
        <div className='table-responsive' style={{height: '320px', margin:'2%'}}>
            <table className='table table-bordered mb-0'>
                <thead className='thead-default'>
                <tr>
                    <th>User</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                
                    {
                       sampleTableContent()
                    }
                
                
            </table>
        </div>
    </div>
)

/**
 * Dynamically generate dummy data
 */
const sampleTableContent = () => {
    let samples = [];
    for(let i = 0; i < 6; i++){
        samples.push(
            (
                <tr key={'tr'+i}>
                    <td>someCoolUser123</td>
                    <td>2018-05-14</td>
                    <td>2018-11-14</td>
                </tr>
            )
        )
    }

    return <tbody>
        {
            samples.map((sample)=>{
                return sample
            })
        }
        </tbody>
}


export default ActiveContract;