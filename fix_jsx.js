const fs = require('fs');
const path = require('path');

const filePath = path.join('app', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: User Detail Modal end + Group Detail Modal start
// Note: We need to match the specific indentation and structure found in the file
const block1Target = `                        )}
                    </div>
                </div>
            </div>
        )
    }

    {/* Group Detail Modal */ }
    {
        selectedGroup && (`;

const block1Replacement = `                        )}
                    </div>
                </div>
                )}

                {/* Group Detail Modal */}
                {selectedGroup && (`;

// Fix 2: Group Detail Modal end + Delete Confirmation Modal start
const block2Target = `                        )}
                    </div>
                </div>
            </div>
        )
    }

    {/* Delete Confirmation Modal */ }
    {
        postToDelete && (`;

const block2Replacement = `                        )}
                    </div>
                </div>
                )}

                {/* Delete Confirmation Modal */}
                {postToDelete && (`;

// Fix 3: Delete Confirmation Modal end + EOF
const block3Target = `                    </div>
                </div>
            </div>
        )
    }
            </main >
        </div >
    );
}`;

const block3Replacement = `                    </div>
                </div>
                )}
            </main>
        </div>
    );
}`;

// Attempting replacements one by one to see which ones match
// Using flexible regex for whitespace if needed, but let's try exact first with normalized line endings

content = content.replace(/\r\n/g, '\n'); // Normalize to LF for matching

if (content.indexOf(block1Target.replace(/\r\n/g, '\n')) !== -1) {
    console.log('Found block 1');
    content = content.replace(block1Target.replace(/\r\n/g, '\n'), block1Replacement.replace(/\r\n/g, '\n'));
} else {
    console.log('Block 1 not found exactly, trying relaxed match');
    // ... maybe do relaxed match if needed
}

if (content.indexOf(block2Target.replace(/\r\n/g, '\n')) !== -1) {
    console.log('Found block 2');
    content = content.replace(block2Target.replace(/\r\n/g, '\n'), block2Replacement.replace(/\r\n/g, '\n'));
} else {
    console.log('Block 2 not found');
}

if (content.indexOf(block3Target.replace(/\r\n/g, '\n')) !== -1) {
    console.log('Found block 3');
    content = content.replace(block3Target.replace(/\r\n/g, '\n'), block3Replacement.replace(/\r\n/g, '\n'));
} else {
    console.log('Block 3 not found');
}

// Global cleanup for broken tags
content = content.replace(/<\/main >/g, '</main>');
content = content.replace(/<\/div >/g, '</div>');

fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8'); // Restore CRLF
console.log('Finished');
