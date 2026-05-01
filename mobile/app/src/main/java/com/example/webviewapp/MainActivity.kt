package com.example.webviewapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.webviewapp.ui.MainScreen
import com.example.webviewapp.ui.SplashScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WebViewAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation()
                }
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "splash") {
        composable("splash") {
            SplashScreen(onTimeout = {
                navController.navigate("main") {
                    popUpTo("splash") { inclusive = true }
                }
            })
        }
        composable("main") {
            //MainScreen(url = "http://192.168.1.118/cti-adp-software/webapp/login.php")
            MainScreen(url = "http://10.0.2.2/cti-adp-software/webapp/login.php")
        }
    }
}

@Composable
fun WebViewAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        content = content
    )
}
