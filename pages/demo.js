import styles from "./main/Teacher.module.scss"
export default function Demo() {
    return (
        <div style={{margin: 'auto', textAlign: 'center'}} className={styles.teacherBody}><br /><br />
            <img src="/icons/loadingLogo.png" /><br /><br /><br /><br /><br /><br /><br />
            <h1 style={{fontSize: '48px'}}>Experience Schoolthing</h1><br /><br /><br />
            <button onClick={()=>{
               window.location.href='/main'
            }}>
                Open Demo
            </button>
        </div>
    )
}