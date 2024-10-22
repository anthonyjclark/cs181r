#!/usr/bin/env python

from dataclasses import dataclass
from math import atan2, cos, pi, sin


def wrap_to_pi(angle: float) -> float:
    return (angle + pi) % (2 * pi) - pi


@dataclass
class Pose:
    x: float = 0
    y: float = 0
    theta: float = 0

    def __str__(self) -> str:
        return f"{self.x:.3f} {self.y:.3f} {self.theta:.3f}"


class ForwardKinematics:
    def __init__(self, track_width: float):
        self.track_width = track_width
        self.pose = Pose()

    def update(self, left_velocity: float, right_velocity: float, dt: float) -> Pose:
        xRdot = (right_velocity + left_velocity) / 2
        thetadot = (right_velocity - left_velocity) / self.track_width

        self.pose.x += xRdot * cos(self.pose.theta) * dt
        self.pose.y += xRdot * sin(self.pose.theta) * dt
        self.pose.theta = wrap_to_pi(self.pose.theta + thetadot * dt)

        return self.pose


class GoalPositionControl:
    def __init__(
        self,
        x_goal: float,
        y_goal: float,
        max_angular_velocity: float,
        max_linear_velocity: float,
        track_width: float,
        K_orientation: float,
        K_position: float,
    ):
        self.x_goal = x_goal
        self.y_goal = y_goal

        self.max_angular_velocity = max_angular_velocity
        self.max_linear_velocity = max_linear_velocity

        self.track_width = track_width

        self.K_orientation = K_orientation
        self.K_position = K_position

    def update(self, pose: Pose, threshold: float) -> tuple[float, float]:
        d_error = ((self.x_goal - pose.x) ** 2 + (self.y_goal - pose.y) ** 2) ** 0.5

        if d_error < threshold:
            return 0, 0

        v = min(self.K_position * d_error, self.max_linear_velocity)

        theta_to_goal = atan2(self.y_goal - pose.y, self.x_goal - pose.x)
        theta_error = theta_to_goal - pose.theta
        thetadot = min(self.K_orientation * theta_error, self.max_angular_velocity)

        left_velocity = v - thetadot * self.track_width / 2
        right_velocity = v + thetadot * self.track_width / 2

        return left_velocity, right_velocity


time = 0
TIME_STEP = 0.1
TIME_END = 20

TRACK_WIDTH = 0.17

forward_kinematics = ForwardKinematics(TRACK_WIDTH)

GOAL_X = -1
GOAL_Y = 1
GOAL_THRESHOLD = 0.1

MAXIMUM_ANGULAR_VELOCITY = 1
MAXIMUM_LINEAR_VELOCITY = 0.3
K_ORIENTATION = 1
K_POSITION = 0.2

goal_position_control = GoalPositionControl(
    GOAL_X,
    GOAL_Y,
    MAXIMUM_ANGULAR_VELOCITY,
    MAXIMUM_LINEAR_VELOCITY,
    TRACK_WIDTH,
    K_ORIENTATION,
    K_POSITION,
)

left_velocity = 0
right_velocity = 0

for _ in range(int(TIME_END / TIME_STEP)):
    pose = forward_kinematics.update(left_velocity, right_velocity, TIME_STEP)
    left_velocity, right_velocity = goal_position_control.update(pose, GOAL_THRESHOLD)
    print(f"{time:.3f} {pose} {left_velocity:.3f} {right_velocity:.3f}")
    time += TIME_STEP
