import React, { useState, useCallback } from 'react'
import TextInput from '../../components/UIkit/TextInput'
import PrimaryButton from '../../components/UIkit/PrimaryButton';
import { useDispatch } from 'react-redux'
import {resetPassword} from '../../reducks/users/operations';
import {push} from 'connected-react-router';

const Reset = () => {

    const dispatch = useDispatch();

    
    const [email, setEmail] = useState("")

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail])


    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">パスワードのリセット</h2>
            <div className="module-spacer--medium" />

            <TextInput 
                fullWidth={true} label={"メールアドレス"} multiline={false} required={true} 
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <div className="module-spacer--medium"/>
            <div className="center">
                <PrimaryButton 
                    label={"Reset Password"}
                    onClick={() =>dispatch(resetPassword(email))}
                />
                <div className="module-spacer--medium"/>
                <p　onClick={() => dispatch(push('/signup'))}>アカウント登録はこちら</p>
                <p　onClick={() => dispatch(push('/signin'))}>アカウントをお持ちの方はこちら</p>
            </div>
        </div>
    )
}

export default Reset