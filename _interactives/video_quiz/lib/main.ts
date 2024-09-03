interface Quiz {
  question: string;
  time: number;
  type: 'multiple-choice' | 'multi-select' | 'written-response' | 'info';
  answers: string[];
  correct: number[]; // Indices of correct answers
  explanation?: string; // Optional, for written responses or other info
}


// Sample data or events, such as `shadamaEvents`, should be defined or loaded as needed.
declare const shadamaEvents: [string, number][]; // Example declaration

export class video_quiz {
  private player!: YT.Player;
  private eventDivs: Array<[HTMLDivElement, number]> = [];
  private caption: HTMLElement | null = null;
  private interval: number | undefined;
  private scroller: number | undefined;
  private quizTimes: Quiz[] = [];
  private currentQuizIndex: number = 0;
  private selectedAnswerIndices: number[] = []; // To handle multi-select
  private videoId: string;
  private currentQuestionType: string = ''; // To keep track of the current question type


  constructor(videoId: string) {
    console.log('video_quiz class instantiated');
    this.videoId = videoId; // Store the video ID
    this.initializeYouTubeAPI();
    this.submitAnswer = this.submitAnswer.bind(this);
    this.submitMultiSelect = this.submitMultiSelect.bind(this); // Bind method
  }

  private initializeYouTubeAPI(): void {
    console.log('Initializing YouTube API');
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('onYouTubeIframeAPIReady function bound to window');
      this.onYouTubeIframeAPIReady();
    };
  
    // Make sure the API script is loaded before calling initializeYouTubeAPI
    if (typeof (window as any).YT === 'undefined') {
      console.log('YouTube API not yet loaded');
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        console.log('YouTube API script loaded');
        this.onYouTubeIframeAPIReady();
      };
      document.body.appendChild(script);
    } else {
      console.log('YouTube API already loaded');
      this.onYouTubeIframeAPIReady();
    }
  }
  

  private onYouTubeIframeAPIReady(): void {
    console.log('YouTube API is ready');
    if (!document.getElementById('player')) {
      console.error('Element with ID "player" not found');
      return;
    } 
    this.player = new YT.Player('player', {
      height: '432px',
      width: '768px',
      videoId: this.videoId, // Use the video ID from the constructor
      playerVars: { rel: 0, showinfo: 0 },
      events: {
        'onReady': () => { console.log('Player is ready'); },
        'onStateChange': (event: YT.OnStateChangeEvent) => this.onPlayerStateChange(event)
      }
    });

    this.initialize();
  }

  private initialize(): void {
    console.log('Initializing quiz components');
    this.caption = document.getElementById("caption");
    if (this.caption) {
      this.eventDivs = shadamaEvents.map(event => this.processOne(event)); // [[div, time]] 
    } else {
      console.error("Caption element not found");
    }
  }
  
  public loadQuizzes(input: string): void {
    this.quizTimes = this.parseQuestions(input);
    console.log('Quizzes loaded:', this.quizTimes);
  }


  private processOne(event: [string, number]): [HTMLDivElement, number] {
    const p = document.createElement("div");
    p.innerHTML = "<p class='caption'>" + event[0] + "</p>";
    this.caption!.appendChild(p);
    return [p, event[1]];
  }

  private onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    console.log('Player state changed:', event.data);

    if (event.data === YT.PlayerState.PLAYING) {
      console.log('Video is playing');
      this.interval = window.setInterval(() => {
        this.updateEventHighlight();
        this.checkQuizTimes();
      }, 1000);
      this.updateEventHighlight();
    } else if (event.data === YT.PlayerState.ENDED ||
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.BUFFERING) {
      if (this.interval !== undefined) window.clearInterval(this.interval);
      console.log('Interval cleared');
    }
  }

  private updateEventHighlight(): void {
    // Remove highlight class from all elements
    Array.from(document.getElementsByClassName('highlight')).forEach(p => {
      p.classList.remove('highlight');
    });
  
    const time = parseFloat(this.player.getCurrentTime().toString());
    const event = this.findEvent(time, this.eventDivs);
  
    if (!event) {
      return;
    }
  
    // Ensure event.firstChild is not null
    const firstChild = event.firstChild;
    if (firstChild instanceof HTMLElement) { // Check if firstChild is an instance of HTMLElement
      firstChild.classList.add("highlight");
    } else {
      console.log('No child element found or firstChild is not an HTMLElement.');
      return; // Exit the function if firstChild is not usable
    }
  
    this.smoothScrollTo(event.offsetTop - this.eventDivs[0][0].offsetTop, Date.now(), 300);
  }
  

  private findEvent(time: number, events: Array<[HTMLDivElement, number]>): HTMLDivElement | undefined {
    for (let i = 0; i < events.length - 1; i++) {
      const pair = events[i];
      const next = events[i + 1];
      if (pair[1] <= time && time < next[1]) {
        return pair[0];
      }
    }
    const lastPair = events[events.length - 1];
    if (lastPair[1] < time) {
      return lastPair[0];
    }
    return undefined;
  }

  private smoothScrollTo(top: number, start: number, duration: number): void {
    if (this.scroller !== undefined) cancelAnimationFrame(this.scroller);
    const current = this.caption!.scrollTop;
    if (current !== top) {
      const t = Date.now() - start;
      if (t >= duration) {
        this.caption!.scrollTop = top;
      } else {
        this.caption!.scrollTop = current + t / duration * (top - current);
        this.scroller = requestAnimationFrame(() => { this.smoothScrollTo(top, start, duration); });
      }
    }
  }

  public checkQuizTimes(): void {
    const currentTime = this.player.getCurrentTime();
    const currentQuiz = this.quizTimes[this.currentQuizIndex];

    if (currentQuiz && currentTime >= currentQuiz.time) {
      this.player.pauseVideo();
      this.showPopup(currentQuiz);
      this.currentQuizIndex++;
    }
  }


  public showPopup(quiz: Quiz): void {
    const popup = document.getElementById('questionPopup') as HTMLDivElement;
    const answersDiv = document.getElementById('answers') as HTMLDivElement;
    const questionText = document.getElementById('questionText') as HTMLParagraphElement;

    if (popup && questionText) {
        questionText.textContent = quiz.question;
        answersDiv.innerHTML = '';

        // Set the current question type and reset selected answers
        this.currentQuestionType = quiz.type;
        this.selectedAnswerIndices = [];

        if (quiz.type === 'multiple-choice' || quiz.type === 'multi-select') {
            quiz.answers.forEach((answer, index) => {
                const answerButton = document.createElement('button');
                answerButton.textContent = answer;
                answerButton.onclick = () => this.selectAnswer(index, answerButton);
                answersDiv.appendChild(answerButton);
            });

            popup.style.display = 'block';
            this.toggleBackdrop(true);
        } else if (quiz.type === 'written-response') {
            // Handle written response
            const input = document.createElement('textarea');
            input.placeholder = 'Write your response here...';
            answersDiv.appendChild(input);

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.onclick = () => {
                console.log('Written response:', input.value);
                this.submitWrittenResponse();
            };
            answersDiv.appendChild(submitButton);

            document.getElementById('writtenResponsePopup')!.style.display = 'block';
            this.toggleBackdrop(true);
        } else if (quiz.type === 'info') {
            // Handle info popups
            const infoPopup = document.getElementById('infoPopup') as HTMLDivElement;
            const infoText = document.getElementById('infoText') as HTMLParagraphElement;
            
            if (infoPopup && infoText) {
                infoText.textContent = quiz.question; // Set info text here
                infoPopup.style.display = 'block';
                this.toggleBackdrop(true);
            } else {
                console.error('Info popup or infoText element not found');
            }
        }
    } else {
        console.error('Popup or questionText element not found');
    }
    
    // Move the index increment here, after showing the quiz
    this.currentQuizIndex++;
}



private selectAnswer(selectedIndex: number, button: HTMLButtonElement): void {
  if (this.currentQuestionType === 'multi-select') {
      // Multi-select logic: toggle selection
      const isSelected = this.selectedAnswerIndices.includes(selectedIndex);
      if (isSelected) {
          this.selectedAnswerIndices = this.selectedAnswerIndices.filter(index => index !== selectedIndex);
          button.classList.remove('selected');
      } else {
          this.selectedAnswerIndices.push(selectedIndex);
          button.classList.add('selected');
      }
  } else if (this.currentQuestionType === 'multiple-choice') {
      // Multiple-choice logic: only one selection allowed
      this.selectedAnswerIndices = [selectedIndex];
      const answerButtons = document.querySelectorAll('#answers button');
      answerButtons.forEach((btn, index) => {
          if (index === selectedIndex) {
              btn.classList.add('selected');
          } else {
              btn.classList.remove('selected');
          }
      });
  }

  // Logging for debugging purposes
  console.log('Selected answer indices:', this.selectedAnswerIndices);
}


  private toggleBackdrop(visible: boolean): void {
    const backdrop = document.getElementById('backdrop') as HTMLDivElement;
    backdrop.style.display = visible ? 'block' : 'none';
  }

  public submitAnswer(): void {
    const popup = document.getElementById('questionPopup') as HTMLDivElement;

    // Use the correct index for the current quiz
    const currentQuiz = this.quizTimes[this.currentQuizIndex-1]; // -1 because index was incremented after displaying the quiz

    console.log("Submitting answer for quiz:", currentQuiz);

    if (!currentQuiz) {
        console.error('No current quiz found');
        return;
    }

    // Check if the current quiz type is multiple-choice or multi-select
    if (currentQuiz.type === 'multiple-choice' || currentQuiz.type === 'multi-select') {
        const isCorrect = this.selectedAnswerIndices.every(index => currentQuiz.correct.includes(index)) &&
            currentQuiz.correct.length === this.selectedAnswerIndices.length;

        // Show appropriate feedback based on answer correctness
        if (isCorrect) {
            this.showFeedback('Correct:', 'You got it right!');
            console.log("Correct answer");
        } else {
            const correctAnswers = currentQuiz.correct.map(index => currentQuiz.answers[index]).join(', ');
            this.showFeedback('Incorrect:', `The correct answer is ${correctAnswers}`);
            console.log("Incorrect answer");
        }

        // Reset selected answers for the next question
        this.selectedAnswerIndices = [];
    } else {
        console.warn('Unexpected quiz type in submitAnswer');
    }

    // Hide the popup and resume the video
    popup.style.display = 'none';
    // this.toggleBackdrop(false);
    // this.player.playVideo();
}


private showFeedback(title: string, message: string): void {
    const feedbackPopup = document.getElementById('feedbackPopup') as HTMLDivElement;
    const feedbackTitle = document.getElementById('feedbackTitle') as HTMLHeadingElement;
    const feedbackMessage = document.getElementById('feedbackMessage') as HTMLParagraphElement;
    const continueButton = document.getElementById('continueButton') as HTMLButtonElement;

    if (feedbackPopup && feedbackTitle && feedbackMessage && continueButton) {
      feedbackTitle.textContent = title;
      feedbackMessage.textContent = message;
      feedbackPopup.style.display = 'block';
      this.toggleBackdrop(true);

      // Pause the video
      this.player.pauseVideo(); 

      // Attach event listener to continueButton
      continueButton.onclick = () => {
          feedbackPopup.style.display = 'none';
          this.toggleBackdrop(false);
          this.player.playVideo(); // Resume video playback after closing feedback
      };
  } else {
      console.error('Feedback elements not found');
  }
}


public submitMultiSelect(): void {
  const popup = document.getElementById('questionPopup') as HTMLDivElement;

  // Get the current quiz
  const currentQuiz = this.quizTimes[this.currentQuizIndex-1]; // Adjust index as needed

  if (!currentQuiz || currentQuiz.type !== 'multi-select') {
    console.error('Expected multi-select quiz type, but got:', currentQuiz?.type);
    return;
  }

  // Collect selected answers
  const selectedAnswers = this.selectedAnswerIndices.map(index => currentQuiz.answers[index]);
  const correctAnswers = currentQuiz.correct.map(index => currentQuiz.answers[index]);

  // Check if all selected answers are correct
  const isCorrect = selectedAnswers.length === correctAnswers.length &&
                    selectedAnswers.every(answer => correctAnswers.includes(answer));

  if (isCorrect) {
    this.showFeedback('Correct:', 'You got it right!');
    console.log("Multi-select correct answers");
  } else {
    this.showFeedback('Incorrect:', `The correct answers are: ${correctAnswers.join(', ')}`);
    console.log("Multi-select incorrect answers");
  }

  // Reset selected answers
  this.selectedAnswerIndices = [];

  // Hide the popup and resume the video
  popup.style.display = 'none';
  // this.toggleBackdrop(false);
  // this.player.playVideo();
}


public continueFromFeedback(): void {
    const feedbackPopup = document.getElementById('feedbackPopup') as HTMLDivElement;
    feedbackPopup.style.display = 'none'; // Hide the feedback popup
    this.toggleBackdrop(false);
    this.player.playVideo(); // Resume the video
}

  public submitWrittenResponse(): void {
    const writtenResponsePopup = document.getElementById('writtenResponsePopup') as HTMLDivElement;
    writtenResponsePopup.style.display = 'none'; // Hide the pop-up
    this.toggleBackdrop(false);
    this.player.playVideo(); 
  }

  public continueVideo(): void {
    const popups = ['explanationPopup', 'infoPopup', 'congratulationPopup'];
    popups.forEach(id => {
      const popup = document.getElementById(id) as HTMLDivElement;
      if (popup) {
        popup.style.display = 'none';
      }
    });
    this.toggleBackdrop(false);
    this.player.playVideo();
  }

  public pauseVideo(): void {
    if (this.player) {
        this.player.pauseVideo();
    } else {
        console.error('Player not initialized');
    }
}

public getCurrentTime(): number {
  if (this.player) {
    return Math.floor(this.player.getCurrentTime());; // Ensure this returns a number
  } else {
      console.error('Player not initialized');
      return 0; // Return a default number if player is not initialized
  }
}

public parseQuestions(input: string): Quiz[] {
  const lines = input.split('\n');
  const quizzes: Quiz[] = [];
  let currentQuiz: Quiz | null = null;
  let xCount = 0; // Counter for (x) answers

  const finalizeCurrentQuiz = () => {
      if (currentQuiz && (currentQuiz.answers.length > 0 || currentQuiz.question)) {
          // Determine type based on xCount
          if (xCount > 1) {
              currentQuiz.type = 'multi-select';
          } else if (xCount === 1) {
              currentQuiz.type = 'multiple-choice';
          }

          // Ensure answers and correct arrays are initialized
          currentQuiz.answers = currentQuiz.answers || [];
          currentQuiz.correct = currentQuiz.correct || [];

          quizzes.push(currentQuiz);
      }
  };

  lines.forEach(line => {
      line = line.trim(); // Trim whitespace

      if (line.startsWith('Q:')) {
          finalizeCurrentQuiz();

          // Extract question and time
          const questionTimeMatch = line.match(/Q: (.*?) \((\d+)\)$/);
          currentQuiz = {
              question: questionTimeMatch ? questionTimeMatch[1].trim() : line.substring(2).trim(),
              time: questionTimeMatch ? parseInt(questionTimeMatch[2], 10) : 0,
              answers: [], // Initialize answers
              correct: [], // Initialize correct answers
              type: 'multiple-choice', // Default type, will adjust based on answers
          };
          xCount = 0; // Reset xCount for new question
      } else if (line.startsWith('(x)') || line.startsWith('( )')) {
          const isCorrect = line.startsWith('(x)');
          const answer = line.substring(3).trim();

          if (!currentQuiz) return;

          // Add the answer
          currentQuiz.answers.push(answer);
          if (isCorrect) {
              xCount++;
              currentQuiz.correct.push(currentQuiz.answers.length - 1);
          }
      } else if (line.startsWith('|__|')) {
          if (currentQuiz) {
              currentQuiz.type = 'written-response';
              currentQuiz.explanation = 'Thank you for sharing your response.';
          }
      } else if (line.startsWith('E:')) {
          finalizeCurrentQuiz();

          // Extract info question
          const infoQuestionMatch = line.match(/E: (.*?) \((\d+)\)$/);
          currentQuiz = {
              question: infoQuestionMatch ? infoQuestionMatch[1].trim() : line.substring(2).trim(),
              time: infoQuestionMatch ? parseInt(infoQuestionMatch[2], 10) : 0,
              type: 'info',
              answers: [], // Initialize for consistency
              correct: [], // Initialize for consistency
          };
          xCount = 0; // Reset xCount for new question
      }
  });

  // Finalize the last quiz if it exists
  finalizeCurrentQuiz();
 
  this.quizTimes = quizzes; // Store parsed quizzes
  return quizzes;
}

}