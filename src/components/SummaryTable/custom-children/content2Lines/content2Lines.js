import React, {useEffect, useState} from 'react';
import { Checkbox } from 'antd';
import './content2Lines.css';

class Lines {
  constructor(data) {
    this.ctn = data.ctn;
    this.value = data.value
    this.model = data.model
    this.imei = data.imei
  }
}

const ContentTwoLines = ({
  variables
}) => {

  const {
    title,
    ctn,
    state,
    linesSelected,
    setLinesSelected,
    setLinesChange
  } = variables

  const [valueDatas, setValueDatas] = useState([]);
  const [linesData, setLinesData] = useState({});
  const datas = {};

  const onChange = (e) => {
    const selection = linesSelected;
    const ctnAccount = e.target.value;
    if (selection.includes(ctnAccount)) {
      const index = selection.indexOf(ctnAccount);
      if (index > -1) {
        selection.splice(index, 1);
      }
    } else {
      selection.push(ctnAccount);
    }
    setLinesSelected(selection);
    setLinesChange(true);
  }

  useEffect(() => {
    const lineDetails = state?.lineDetails;
    lineDetails.forEach(element => {
      const included = ctn.includes(element.telephoneNumber)
      if (!datas[element.telephoneNumber] && included) {
        const data = {
          ctn: element?.telephoneNumber,
          value: false,
          imei: element?.imei,
          model: element?.currentDevice?.model
        }
        datas[element.telephoneNumber] = new Lines(data);
      }
    })
    setValueDatas(Object.keys(datas));
    setLinesData(datas)
  }, [])

  const lines = valueDatas.map(element => <Checkbox value={element} className="checkboxes" disabled={linesData[element]?.value} onChange={onChange}><div className="checkbox-lines"><div>{linesData[element].ctn}</div><div>{linesData[element].model}</div></div></Checkbox>)

  return (
    <>
      <section>
        <p>{title}</p>
      </section>
      <section>
      <div className='lines-popup'>
        {lines}
      </div>
      </section>
    </>
  );
}

export default ContentTwoLines;
