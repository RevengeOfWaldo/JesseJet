document.addEventListener('DOMContentLoaded', () => {
    const aircraftDirectionInput = document.getElementById('aircraftDirection');
    const trueAirspeedInput = document.getElementById('trueAirspeed');
    const windDirectionInput = document.getElementById('windDirection');
    const windSpeedInput = document.getElementById('windSpeed');
    const n1PercentageInput = document.getElementById('n1Percentage'); // N1 is informational
    const calculateBtn = document.getElementById('calculateBtn');

    const headwindTailwindSpan = document.getElementById('headwindTailwind');
    const crosswindSpan = document.getElementById('crosswind');
    const groundSpeedSpan = document.getElementById('groundSpeed');
    const trueCourseSpan = document.getElementById('trueCourse');

    calculateBtn.addEventListener('click', calculatePerformance);

    function calculatePerformance() {
        const aircraftDirection = parseFloat(aircraftDirectionInput.value); // Aircraft Heading (True)
        const trueAirspeed = parseFloat(trueAirspeedInput.value); // True Airspeed (Knots)
        const windDirection = parseFloat(windDirectionInput.value); // Wind Direction (From)
        const windSpeed = parseFloat(windSpeedInput.value); // Wind Speed (Knots)
        const n1Percentage = parseFloat(n1PercentageInput.value); // Informational N1

        // Input validation
        if (isNaN(aircraftDirection) || isNaN(trueAirspeed) || isNaN(windDirection) || isNaN(windSpeed)) {
            alert('Please enter valid numbers for all primary inputs.');
            return;
        }
        if (aircraftDirection < 0 || aircraftDirection > 359 || windDirection < 0 || windDirection > 359) {
            alert('Directions must be between 0 and 359 degrees.');
            return;
        }
        if (trueAirspeed < 0 || windSpeed < 0) {
            alert('Speeds cannot be negative.');
            return;
        }

        // Convert degrees to radians for trigonometric functions
        const degToRad = Math.PI / 180;
        const aircraftDirectionRad = aircraftDirection * degToRad;
        const windDirectionRad = windDirection * degToRad; // Wind is FROM this direction

        // --- Calculate Wind Components ---
        // Angle between aircraft heading and wind direction (where wind is *coming from*)
        // This angle is used for headwind/tailwind and crosswind components
        const relativeWindAngle = (windDirection - aircraftDirection + 360) % 360; // Normalize to 0-359

        // Headwind/Tailwind Component
        // If relativeWindAngle is 0 (wind from dead ahead), cos(0) = 1 (full headwind)
        // If relativeWindAngle is 180 (wind from dead behind), cos(180) = -1 (full tailwind)
        const headwindComponent = windSpeed * Math.cos(relativeWindAngle * degToRad);

        // Crosswind Component
        // If relativeWindAngle is 90 (wind from right side), sin(90) = 1 (right crosswind)
        // If relativeWindAngle is 270 (wind from left side), sin(270) = -1 (left crosswind)
        const crosswindComponent = windSpeed * Math.sin(relativeWindAngle * degToRad);

        // --- Calculate Ground Speed and True Course (Ground Track) using Vector Addition ---
        // Convert wind direction (FROM) to wind velocity direction (TO)
        const windVelocityDirectionRad = (windDirection + 180) % 360 * degToRad;

        // Aircraft velocity vector components (True Airspeed along Aircraft Heading)
        const aircraftVelX = trueAirspeed * Math.sin(aircraftDirectionRad);
        const aircraftVelY = trueAirspeed * Math.cos(aircraftDirectionRad);

        // Wind velocity vector components (Wind Speed along Wind Velocity Direction)
        const windVelX = windSpeed * Math.sin(windVelocityDirectionRad);
        const windVelY = windSpeed * Math.cos(windVelocityDirectionRad);

        // Ground velocity vector components (sum of aircraft and wind velocity vectors)
        const groundVelX = aircraftVelX + windVelX;
        const groundVelY = aircraftVelY + windVelY;

        // Ground Speed (magnitude of the ground velocity vector)
        const groundSpeed = Math.sqrt(groundVelX * groundVelX + groundVelY * groundVelY);

        // True Course (Ground Track - direction of the ground velocity vector)
        let trueCourseRad = Math.atan2(groundVelX, groundVelY);
        let trueCourse = (trueCourseRad * 180 / Math.PI + 360) % 360; // Convert to degrees and normalize to 0-359

        // --- Display Results ---
        headwindTailwindSpan.textContent = headwindComponent.toFixed(2);
        crosswindSpan.textContent = crosswindComponent.toFixed(2);
        groundSpeedSpan.textContent = groundSpeed.toFixed(2);
        trueCourseSpan.textContent = trueCourse.toFixed(1);

        // You could use the n1Percentage here if you had a specific model
        // For example, if N1 was a proxy for a lookup table of fuel burn or climb rate.
        // For this simple calculator, it's just displayed.
    }

    // Initialize with a calculation on load
    calculatePerformance();
});
