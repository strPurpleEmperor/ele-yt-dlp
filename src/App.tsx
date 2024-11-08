import {useEffect} from 'react'
import './App.css'
import {Input, Button, Form, notification, Card} from "antd";
const offset = 4
function App() {
  const [sForm] = Form.useForm()
  useEffect(() => {
    // 接收主进程返回的 Cookie 数据
    window.ipcRenderer.on('cookies-updated', (event, cookies) => {
      console.log('获取的 Cookies:', cookies);
    });
    window.ipcRenderer.on('yt-dlp-updated', (event, ytDlpCode) => {
      sForm.setFieldValue('yt-dlp-code', ytDlpCode.toString())
    });
  }, []);
  return (
    <Card>
      <Form form={sForm} labelCol={{span: offset}}>
        <Form.Item label='下载视频的链接' name='downloadUrl'>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{offset}}>
          <Button
            onClick={() => {
              const downloadUrl = sForm.getFieldValue('downloadUrl')
              if (!downloadUrl) return notification.error({message: '先输入下载链接'})
              window.ipcRenderer.send('download-video', downloadUrl);
            }}
            type='primary'
          >
            下载视频
          </Button>
        </Form.Item>

        <Form.Item label='下载输出' name='yt-dlp-code'>
          <Input.TextArea rows={10} readOnly/>
        </Form.Item>
        <Form.Item wrapperCol={{offset}}>
          <h3>
            对与需要登录才能下载高清视频的网站（比如B站），可以在下面输入网站地址打开网站去登录，然后点击更新cookie按钮获取登录态
          </h3>
        </Form.Item>
        <Form.Item label='登录网站地址' name='loginUrl'>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{offset}}>
          <Button onClick={() => {
            const loginUrl = sForm.getFieldValue('loginUrl')
            if (!loginUrl) return notification.error({message: '先输入地址'})
            window.ipcRenderer.send('open-new-win', loginUrl)
          }}>打开网站</Button>
        </Form.Item>
        <Form.Item wrapperCol={{offset}}>
          <Button type='primary' onClick={() => {
            window.ipcRenderer.send('get-cookies');
          }}>更新cookie</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default App