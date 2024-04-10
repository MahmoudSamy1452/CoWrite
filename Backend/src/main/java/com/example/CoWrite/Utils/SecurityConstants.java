package com.example.CoWrite.Utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


public class SecurityConstants {
    public static final long JWT_EXPIRATION = 10L * 365 * 24 * 60 * 60 * 1000;
    public static String JWT_SECRET = "32e1385a6589c2a0263b27a49f0aa507ce1d80c6ec0955f0bd91394827aa42dd0f424e93ac7b21001fcf27ba19fa8040e9669b92f7ee3bd83bbacd4dcc514e43";
}