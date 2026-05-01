package com.example.webviewapp.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onTimeout: () -> Unit) {
    // Logic for 4-second delay
    LaunchedEffect(Unit) {
        delay(4000)
        onTimeout()
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Loading LPA Admin...",
            style = MaterialTheme.typography.headlineMedium
        )
        // Add a progress indicator for visual feedback
        CircularProgressIndicator(
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun SplashScreenPreview() {
    SplashScreen(onTimeout = {})
}
